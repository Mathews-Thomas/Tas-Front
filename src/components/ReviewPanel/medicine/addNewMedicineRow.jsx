import { useEffect, useMemo, useState } from "react";
import SelectBox from "../../../components/common/SelectBox";
import TextFieldInput from "../../../components/common/inputbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import showAlert from "../../../commonFn/showAlert";

function AddNewMedicineRow({ medicines, onAdd, sl }) {
  const datalist = medicines?.map((item) => ({
    type: item?.medicineName,
    description: item?.category,
    _id: item?._id,
    HSNCode: item?.batchNumber,
    GST: item?.price,
    strength: item?.strength,
  }));

  const [newItem, setNewItem] = useState({
    MedicineID: "",
    medicineName: "",
    quantity: 1,
    unitPrice: 0,
    discountType: "INR",
    HSNCode: "",
    discount: 0,
    totalAmount: 0,
    amountToBePaid: 0,
    GST: 0,
    baseAmount: 0,
    gstAmount: 0,
  });

  useEffect(() => {
    setNewItem({
      MedicineID: "",
      medicineName: "",
      quantity: 1,
      unitPrice: 0,
      discountType: "INR",
      HSNCode: "",
      discount: 0,
      totalAmount: 0,
      amountToBePaid: 0,
      GST: 0,
      baseAmount: 0,
      gstAmount: 0,
    });
  }, [medicines]);

  const calculateTotal = (unitPrice, quantity, discount, discountType) => {
    let total = unitPrice * quantity;
    const discountValue =
      discountType === "INR" ? discount : (total * discount) / 100;
    total = total - discountValue;
    return Math.max(total, 0);
  };

  const calculatedValues = useMemo(() => {
    const totalAmount = newItem.unitPrice * newItem.quantity;
    const amountToBePaid = calculateTotal(
      newItem.unitPrice,
      newItem.quantity,
      newItem.discount,
      newItem.discountType
    );
    const baseAmount = (amountToBePaid / (1 + newItem.GST / 100)).toFixed(2);
    const gstAmount = ((baseAmount * newItem.GST) / 100).toFixed(2);

    return { totalAmount, amountToBePaid, baseAmount, gstAmount };
  }, [
    newItem.unitPrice,
    newItem.quantity,
    newItem.discount,
    newItem.discountType,
    newItem.GST,
  ]);

  useEffect(() => {
    setNewItem((prev) => ({
      ...prev,
      ...calculatedValues,
    }));
  }, [calculatedValues]);

  const handleDropdown = (value) => {
    const data = datalist.find((obj) => obj.type === value) || {};
    setNewItem((prev) => ({
      ...prev,
      medicineName: value || "",
      MedicineID: data?._id || "",
      GST: data?.GST || 0,
      HSNCode: data?.HSNCode || "",
    }));
  };

  const updateField = (field, value) => {
    setNewItem((prevItem) => ({ ...prevItem, [field]: value }));
  };

  const handleAddClick = () => {
    if (!newItem.medicineName) {
      showAlert("Medicine Required.!", " ", "warning");
      return;
    }
    if (newItem.quantity <= 0) {
      showAlert("Quantity Required.!", " ", "warning");
      return;
    }
    if (newItem.unitPrice <= 0) {
      showAlert("Unit Price Required.!", " ", "warning");
      return;
    }
    onAdd(newItem);
    setNewItem({
      MedicineID: "",
      medicineName: "",
      quantity: 1,
      unitPrice: 0,
      discountType: "INR",
      HSNCode: "",
      discount: 0,
      totalAmount: 0,
      amountToBePaid: 0,
      GST: 0,
      baseAmount: 0,
      gstAmount: 0,
    });
  };

  const discountTypeOptions = [{ type: "INR" }, { type: "%" }];

  return (
    <tr className="border-none">
      <td className="text-center">{sl}</td>
      <td className="p-2 w-[20%]">
        <SelectBox
          id={"medicine"}
          label={"Medicine"}
          options={datalist}
          fullWidth
          onChange={(selectedValue) => handleDropdown(selectedValue)}
          value={newItem?.medicineName}
        />
      </td>
      <td className="p-2 w-[7%]">
        <TextFieldInput
          label="HSNCode"
          name="HSNCode"
          type="text"
          disabled
          value={newItem.HSNCode}
          onChange={(e) => updateField("HSNCode", Number(e.target.value))}
        />
      </td>
      <td className="p-2 w-[7%]">
        <TextFieldInput
          label="Qty"
          name="quantity"
          type="number"
          value={newItem.quantity}
          onChange={(e) => updateField("quantity", Number(e.target.value))}
        />
      </td>
      <td className="p-2 w-[10%]">
        <TextFieldInput
          label="Unit Price"
          name="unitPrice"
          type="number"
          value={newItem.unitPrice}
          onChange={(e) => updateField("unitPrice", Number(e.target.value))}
        />
      </td>
      <td className="pl-2 w-[15%]">
        <div className="flex w-full">
          <div className="w-1/2">
            <TextFieldInput
              label="Discount"
              name="discount"
              type="number"
              value={newItem.discount}
              onChange={(e) => updateField("discount", Number(e.target.value))}
            />
          </div>
          <div className="w-1/2">
            <SelectBox
              id="discountType"
              label="Type"
              options={discountTypeOptions}
              onChange={(value) => updateField("discountType", value)}
              value={newItem?.discountType}
            />
          </div>
        </div>
      </td>
      <td className="p-2  w-[10%]">
        <TextFieldInput
          label={"GST %"}
          name={"GST"}
          disabled
          type={"number"}
          value={newItem?.GST}
          onChange={(e) => {
            updateField("GST", Number(e.target.value));
          }}
        />
      </td>
      <td className="p-2  w-[10%]">
        <TextFieldInput
          label={"Taxable Amount"}
          name={"baseAmount"}
          disabled
          type={"number"}
          value={newItem?.baseAmount}
          onChange={(e) => {
            updateField("baseAmount", Number(e.target.value));
          }}
        />
      </td>
      <td className="p-2   w-[10%]">
        <TextFieldInput
          label={"GST Amount"}
          name={"gstAmount"}
          type={"number"}
          value={newItem.gstAmount}
          disabled
          onChange={(e) => {
            updateField("gstAmount", Number(e.target.value));
          }}
        />
      </td>
      <td className="text-center">{newItem.amountToBePaid}</td>
      <td className="p-2">
        <button
          className=" bg-green-400 rounded-full py-2 px-3"
          onClick={handleAddClick}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </td>
    </tr>
  );
}

export default AddNewMedicineRow;
