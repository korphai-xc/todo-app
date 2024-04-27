import { FormInstance } from "antd";

export interface Props {
  title: string;
  form: FormInstance;
  isOpen: boolean;
  onOk: () => void;
  onCancel: () => void;
}
