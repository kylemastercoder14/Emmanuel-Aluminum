/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";

import {
  EditIcon,
  MoreHorizontal,
  ArchiveIcon,
  CircleCheck,
  Calendar,
  RefreshCcw,
  Wallet,
  ZoomIn,
  ZoomOut,
  BarChart3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import AlertModal from "@/components/globals/alert-modal";
import { toast } from "sonner";
import { OrderWithOrderItems } from "@/types/interface";
import {
  completeOrderStatus,
  scheduleService,
  verifyPayment,
} from "@/actions/order";
import { Modal } from "@/components/globals/modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { updateServiceHistoryStatus } from "@/actions/service";
import { Progress } from "@/components/ui/progress";

const CellAction = ({ data }: { data: OrderWithOrderItems }) => {
  const router = useRouter();
  const [activeStatusOpen, setActiveStatusOpen] = React.useState(false);
  const [statusOpen, setStatusOpen] = React.useState(false);
  const [scheduleOpen, setScheduleOpen] = React.useState(false);
  const [scheduledDate, setScheduledDate] = React.useState("");
  const [scheduledTime, setScheduledTime] = React.useState("");
  const [isScheduleLoading, setIsScheduleLoading] = React.useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = React.useState(false);
  const [paymentTrackingOpen, setPaymentTrackingOpen] = React.useState(false);
  const [selectedPayment, setSelectedPayment] = React.useState<any>(null);
  const [verifyAmount, setVerifyAmount] = React.useState<number>(0);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [zoomImage, setZoomImage] = React.useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = React.useState<number>(1);
  const [pan, setPan] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = React.useState(false);
  const panStartRef = React.useRef<{ x: number; y: number } | null>(null);

  const openVerifyModal = (payment: any) => {
    setSelectedPayment(payment);
    setVerifyAmount(0);
    setVerifyModalOpen(true);
  };

  const openZoomModal = (url: string) => {
    setZoomImage(url);
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleZoomReset = () => {
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  };

  const handleWheelZoom = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const delta = event.deltaY;
    setZoomLevel((prev) => {
      const step = delta > 0 ? -0.25 : 0.25;
      const next = prev + step;
      return Math.min(Math.max(next, 0.5), 3);
    });
  };

  const handlePanStart = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsPanning(true);
    panStartRef.current = {
      x: event.clientX - pan.x,
      y: event.clientY - pan.y,
    };
  };

  const handlePanMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning || !panStartRef.current) return;
    setPan({
      x: event.clientX - panStartRef.current.x,
      y: event.clientY - panStartRef.current.y,
    });
  };

  const handlePanEnd = () => {
    setIsPanning(false);
    panStartRef.current = null;
  };

  const totalAmount = data.totalAmount || 0;
  const paidAmount = data.paidAmount || 0;
  const remainingAmount = Math.max(totalAmount - paidAmount, 0);
  const paymentPercentage = totalAmount > 0 ? Math.min(100, Math.round((paidAmount / totalAmount) * 100)) : 0;

  React.useEffect(() => {
    if (!zoomImage) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        handleZoomIn();
      }
      if (event.key === "-") {
        event.preventDefault();
        handleZoomOut();
      }
      if (event.key === "0") {
        event.preventDefault();
        handleZoomReset();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomImage]);

  const onVerifyPayment = async () => {
    if (!selectedPayment || verifyAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    setIsVerifying(true);
    try {
      const response = await verifyPayment({
        paymentId: selectedPayment.id,
        amount: verifyAmount,
      });
      if (response.success) {
        toast.success(response.message);
        setVerifyModalOpen(false);
        router.refresh();
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  const onStatusActive = async () => {
    try {
      const response = await updateServiceHistoryStatus(
        data.id,
        !data.isActive
      );
      if (response.success) {
        toast.success(response.success);
      } else {
        toast.error(response.error);
      }
      router.refresh();
    } catch (error) {
      toast.error("Failed to change service status. 😥");
      console.error("Status change error:", error);
    } finally {
      setActiveStatusOpen(false);
    }
  };

  const onStatus = async () => {
    try {
      const response = await completeOrderStatus(data.id, "Completed");
      if (response.success) {
        toast.success(response.success);
      } else {
        toast.error(response.error);
      }
      router.refresh();
    } catch (error) {
      toast.error("Failed to change service status. 😥");
      console.error("Status change error:", error);
    } finally {
      setStatusOpen(false);
    }
  };

  const onSchedule = async () => {
    if (!scheduledDate || !scheduledTime) {
      toast.error("Please provide both date and time for scheduling.");
      return;
    }
    setIsScheduleLoading(true);
    try {
      const response = await scheduleService(
        data.id,
        scheduledDate,
        scheduledTime
      );
      if (response.success) {
        toast.success(response.success);
      } else {
        toast.error(response.error);
      }
      router.refresh();
    } catch (error) {
      toast.error("Failed to schedule service. 😥");
      console.error("Schedule error:", error);
    } finally {
      setScheduleOpen(false);
      setIsScheduleLoading(false);
    }
  };
  return (
    <>
      {/* Payment Tracking Modal */}
      <Modal
        isOpen={paymentTrackingOpen}
        onClose={() => setPaymentTrackingOpen(false)}
        title="Payment Tracking"
        className='max-w-4xl!'
        description="Track payment progress and view all recorded payments for this order."
      >
        <div className="space-y-6">
          {/* Summary */}
          <div className="border rounded-lg p-4 bg-muted/30">
            <h3 className="font-semibold mb-2">Payment Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Payment Status</p>
                <p className="font-medium">{data.paymentStatus}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Amount</p>
                <p className="font-medium">₱{totalAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Paid Amount</p>
                <p className="font-medium">₱{paidAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Remaining Balance</p>
                <p className="font-medium">₱{remainingAmount.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{paymentPercentage}%</span>
              </div>
              <Progress value={paymentPercentage} />
            </div>
          </div>

          {/* Payment History */}
          <div>
            <h3 className="font-semibold mb-2">Payment History</h3>
            {data.payments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No payments recorded yet.</p>
            ) : (
              <div className="max-h-72 overflow-y-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-muted text-xs text-muted-foreground">
                    <tr>
                      <th className="py-2 px-3 text-left font-medium">Date</th>
                      <th className="py-2 px-3 text-right font-medium">Amount</th>
                      <th className="py-2 px-3 text-left font-medium">Note</th>
                      <th className="py-2 px-3 text-center font-medium">Attachments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.payments.map((payment) => (
                      <tr key={payment.id} className="border-t last:border-0">
                        <td className="py-2 px-3">
                          {new Date(payment.createdAt).toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-right">
                          ₱{payment.amount.toLocaleString()}
                        </td>
                        <td className="py-2 px-3">
                          {payment.note || "—"}
                        </td>
                        <td className="py-2 px-3 text-center">
                          {payment.attachments?.length ?? 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Verify Payment Modal */}
      <Modal
        isOpen={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
        title="Verify Payment"
        className='max-w-4xl!'
        description="View proof of payment and confirm amount received."
      >
        {selectedPayment && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {selectedPayment.attachments.map((url: string) => (
                <img
                  key={url}
                  src={url}
                  alt="Proof of payment"
                  className="w-full h-80 object-contain rounded border cursor-zoom-in"
                  onClick={() => openZoomModal(url)}
                />
              ))}
            </div>
            <div className="space-y-2">
              <Label>Amount Received</Label>
              <Input
                type="number"
                value={verifyAmount}
                onChange={(e) => setVerifyAmount(parseFloat(e.target.value))}
                placeholder="Enter received amount"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setVerifyModalOpen(false)}
                disabled={isVerifying}
              >
                Cancel
              </Button>
              <Button onClick={onVerifyPayment} disabled={isVerifying}>
                {isVerifying ? "Verifying..." : "Confirm Payment"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
      <Modal
        isOpen={!!zoomImage}
        onClose={() => setZoomImage(null)}
        title="Preview Attachment"
        className='max-w-3xl!'
        description="Zoom in and out to inspect the proof of payment."
      >
        {zoomImage && (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={handleZoomOut}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleZoomReset}
              >
                Reset
              </Button>
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={handleZoomIn}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            <div
              className="max-h-[70vh] overflow-auto flex justify-center"
              onWheel={handleWheelZoom}
            >
              <div
                className="inline-block cursor-grab active:cursor-grabbing"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
                  transformOrigin: "center center",
                }}
                onMouseDown={handlePanStart}
                onMouseMove={handlePanMove}
                onMouseUp={handlePanEnd}
                onMouseLeave={handlePanEnd}
              >
                <img
                  src={zoomImage}
                  alt="Proof of payment zoomed"
                  className="max-h-[70vh] object-contain rounded border"
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
      <AlertModal
        isOpen={activeStatusOpen}
        onClose={() => setActiveStatusOpen(false)}
        onConfirm={onStatusActive}
        title="Change Service History Availability"
        description={`Are you sure you want to make this service history ${data.isActive ? "unavailable" : "available"}?`}
      />
      <AlertModal
        isOpen={statusOpen}
        onClose={() => setStatusOpen(false)}
        onConfirm={onStatus}
        title="Complete Service Request"
        description={`Are you sure you want to complete this service request?`}
      />
      <Modal
        isOpen={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        title="Schedule Service"
        description="Schedule the date and time for the service request."
      >
        <form onSubmit={onSchedule} className="space-y-4">
          <div className="space-y-2">
            <Label>Schedule Date</Label>
            <Input
              type="date"
              disabled={isScheduleLoading}
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Schedule Time</Label>
            <Input
              type="time"
              disabled={isScheduleLoading}
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
            />
          </div>
          <div className="flex justify-end items-center gap-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => setScheduleOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isScheduleLoading}
              variant="default"
              onClick={onSchedule}
            >
              Schedule
            </Button>
          </div>
        </form>
      </Modal>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/admin/service-listings/history/${data.id}`)
            }
          >
            <EditIcon className="size-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setPaymentTrackingOpen(true)}>
            <BarChart3 className="size-4" />
            Payment Tracking
          </DropdownMenuItem>
          {data.payments.length > 0 && (
            <DropdownMenuItem onClick={() => openVerifyModal(data.payments[0])}>
              <Wallet className="size-4" />
              Verify Payment
            </DropdownMenuItem>
          )}
          {data.status === "Pending" || data.status === "Cancelled" ? (
            <DropdownMenuItem onClick={() => setScheduleOpen(true)}>
              <Calendar className="size-4" />
              Schedule Service
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setStatusOpen(true)}>
              <CircleCheck className="size-4" />
              Complete Service
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          {data.isActive ? (
            <DropdownMenuItem onClick={() => setActiveStatusOpen(true)}>
              <ArchiveIcon className="size-4" />
              Archive
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setActiveStatusOpen(true)}>
              <RefreshCcw className="size-4" />
              Retrieve
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
