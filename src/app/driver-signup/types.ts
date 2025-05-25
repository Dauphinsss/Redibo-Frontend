export interface LicenseData {
  number: string;
  issueDate: string;
  expiryDate: string;
  category: string;
}

export interface LicensePhotos {
  front: File | null;
  back: File | null;
}
