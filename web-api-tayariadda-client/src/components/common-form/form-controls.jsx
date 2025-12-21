import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

function FormControls({ formControls = [], formData, setFormData }) {
  const [showPassword, setShowPassword] = useState({});

  const togglePasswordVisibility = (fieldName) => {
    setShowPassword(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  function renderComponentByType(getControlItem) {
    let element = null;
    const currentControlItemValue = formData[getControlItem.name] || "";
    const isPasswordField = getControlItem.type === "password";
    const inputType = isPasswordField && showPassword[getControlItem.name] ? "text" : getControlItem.type;

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <div className="relative">
            <Input
              id={getControlItem.name}
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              type={inputType}
              value={currentControlItemValue}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: event.target.value,
                })
              }
              className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500 transition duration-300"
            />
            {isPasswordField && (
              <button
                type="button"
                onClick={() => togglePasswordVisibility(getControlItem.name)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword[getControlItem.name] ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        );
        break;
      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getControlItem.name]: value,
              })
            }
            value={currentControlItemValue}
          >
            <SelectTrigger className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-300">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent className="bg-white text-gray-900 border border-gray-300">
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                  <SelectItem
                    key={optionItem.id}
                    value={optionItem.id}
                    className="hover:bg-gray-100"
                  >
                    {optionItem.label}
                  </SelectItem>
                ))
                : null}
            </SelectContent>
          </Select>
        );
        break;
      case "textarea":
        element = (
          <Textarea
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            value={currentControlItemValue}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
            className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500 transition duration-300"
          />
        );
        break;

      default:
        element = (
          <div className="relative">
            <Input
              id={getControlItem.name}
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              type={inputType}
              value={currentControlItemValue}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: event.target.value,
                })
              }
              className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500 transition duration-300"
            />
            {isPasswordField && (
              <button
                type="button"
                onClick={() => togglePasswordVisibility(getControlItem.name)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword[getControlItem.name] ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        );
        break;
    }

    return element;
  }

  return (
    <div className="flex flex-col gap-6">
      {formControls.map((controlItem) => (
        <div key={controlItem.name} className="space-y-2">
          <Label htmlFor={controlItem.name} className="text-gray-700 text-sm font-medium">
            {controlItem.label}
          </Label>
          {renderComponentByType(controlItem)}
        </div>
      ))}
    </div>
  );
}

export default FormControls;
