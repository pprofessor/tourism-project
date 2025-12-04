export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ImageEditorProps {
  image: string;
  onSave: (editedImage: string) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

export interface FilterOptions {
  blur: number;
  brightness: number;
  contrast: number;
  saturation: number;
}
