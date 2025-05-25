export interface LicenseData {
  numeroLicencia: string;
  fechaEmision: string;
  fechaVencimiento: string;
  categoria: string;
}

export interface LicensePhotos {
  front: File | null;
  back: File | null;
}
