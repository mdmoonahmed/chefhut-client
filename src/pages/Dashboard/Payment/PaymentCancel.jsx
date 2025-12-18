import React from "react";
import { MdCancel } from "react-icons/md";

const PaymentCancel = () => {
  return (
    <div className="flex justify-center gap-1 place-items-center pt-[50%] sm:pt-40">
      <h1 className="t-primary  text-2xl">Payment Cancelled</h1>
      <span className="text-red-500 text-2xl">
        <MdCancel /> 
      </span>
    </div>
  );
};

export default PaymentCancel;
