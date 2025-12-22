import React, { useEffect, useRef } from "react";

const EsewaPaymentForm = ({ config }) => {
    const formRef = useRef(null);

    useEffect(() => {
        if (config && formRef.current) {
            formRef.current.submit();
        }
    }, [config]);

    if (!config) return null;

    return (
        <form
            ref={formRef}
            action={config.url}
            method="POST"
            className="hidden"
        >
            <input type="hidden" name="amount" value={config.amount} />
            <input type="hidden" name="tax_amount" value={config.tax_amount} />
            <input type="hidden" name="total_amount" value={config.total_amount} />
            <input type="hidden" name="transaction_uuid" value={config.transaction_uuid} />
            <input type="hidden" name="product_code" value={config.product_code} />
            <input type="hidden" name="product_service_charge" value={config.product_service_charge} />
            <input type="hidden" name="product_delivery_charge" value={config.product_delivery_charge} />
            <input type="hidden" name="success_url" value={config.success_url} />
            <input type="hidden" name="failure_url" value={config.failure_url} />
            <input type="hidden" name="signed_field_names" value={config.signed_field_names} />
            <input type="hidden" name="signature" value={config.signature} />
        </form>
    );
};

export default EsewaPaymentForm;
