import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";

const FormField = ({
  label,
  type = "input",
  error,
  className = "",
  children,
  ...props
}) => {
  const renderField = () => {
    switch (type) {
      case "textarea":
        return <Textarea {...props} />;
      case "select":
        return <Select {...props}>{children}</Select>;
      default:
        return <Input {...props} />;
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label htmlFor={props.id || props.name}>
          {label}
        </Label>
      )}
      {renderField()}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default FormField;