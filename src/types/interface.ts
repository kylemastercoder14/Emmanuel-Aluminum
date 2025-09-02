import { Material, Service, Supplier } from "@prisma/client";

export interface SupplierWithMaterial extends Supplier {
  materials: Material[];
}

export interface MaterialWithSupplier extends Material {
  supplier: Supplier;
}

export interface ServiceWithMaterials extends Service {
  materials: MaterialWithSupplier[];
}
