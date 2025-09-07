import React, { useState } from "react";
import IconSubmit from "../assets/Icon_Submit.svg";
import IconValid from "../assets/Icon_Valid.svg";

export default function ContactForm() {
  const [form, setForm] = useState({
    fullName: "",
    emailAddress: "",
    phoneNumbers: [""],
    message: "",
    includeAddressDetails: false,
    addressDetails: {
      addressLine1: "",
      addressLine2: "",
      cityTown: "",
      stateCounty: "",
      postcode: "",
      country: ""
    }
  });

  const [status, setStatus] = useState({ ok: false, errors: {} });
  const [showAddress, setShowAddress] = useState(false);

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setAddr = (k, v) => setForm(f => ({ ...f, addressDetails: { ...f.addressDetails, [k]: v } }));

  const addPhone = () => setForm(f => ({ ...f, phoneNumbers: [...f.phoneNumbers, ""] }));
  const setPhone = (idx, v) => setForm(f => {
    const phones = [...f.phoneNumbers]; phones[idx] = v; return { ...f, phoneNumbers: phones };
  });

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.emailAddress)) e.emailAddress = "Valid email is required";
    if (!form.message.trim()) e.message = "Message is required";
    if (form.includeAddressDetails) {
      if (!form.addressDetails.addressLine1.trim()) e.addressLine1 = "Address line 1 is required";
      if (!form.addressDetails.cityTown.trim()) e.cityTown = "City/Town is required";
      if (!form.addressDetails.postcode.trim()) e.postcode = "Postcode is required";
      if (!form.addressDetails.country.trim()) e.country = "Country is required";
    }
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length) return setStatus({ ok: false, errors });

    setStatus({ ok: false, errors: {} });
    const payload = {
      fullName: form.fullName,
      emailAddress: form.emailAddress,
      phoneNumbers: form.phoneNumbers.filter(Boolean),
      message: form.message,
      includeAddressDetails: form.includeAddressDetails,
      addressDetails: form.includeAddressDetails ? form.addressDetails : null
    };

    try {
      const res = await fetch("https://interview-assessment.api.avamae.co.uk/api/v1/contact-us/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setStatus({ ok: true, errors: {} });
      } else {
        const apiErr = await res.json().catch(() => null);
        setStatus({ ok: false, errors: { api: apiErr?.messageCode || "Submission failed" } });
      }
    } catch {
      setStatus({ ok: false, errors: { api: "Network error. Please try again." } });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {status.ok && (
        <div className="alert alert--success">
          <img src={IconValid} alt="" /> <strong>Your message has been sent</strong><br />
          We will be in contact with you within 24 hours.
        </div>
      )}
      {status.errors.api && <div className="alert alert--error">{status.errors.api}</div>}

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <label className="form-label">Full name *</label>
          <input 
            className="form-control" 
            name="fullName" 
            value={form.fullName}
            onChange={e => setField("fullName", e.target.value)}
            required 
          />
          {status.errors.fullName && <small className="error">{status.errors.fullName}</small>}
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label">Email address *</label>
          <input 
            type="email" 
            className="form-control" 
            name="email" 
            value={form.emailAddress}
            onChange={e => setField("emailAddress", e.target.value)}
            required 
          />
          {status.errors.emailAddress && <small className="error">{status.errors.emailAddress}</small>}
        </div>

        {form.phoneNumbers.map((p, idx) => (
          <div className="col-12" key={idx}>
            <label className="form-label">{`Phone number ${idx + 1}`} {idx === 0 && "- optional"}</label>
            <input className="form-control" name="phone" value={p} onChange={e => setPhone(idx, e.target.value)} />
          </div>
        ))}

        <div className="col-12">
          <button type="button" className="btn btn-primary" onClick={addPhone}>Add new phone number</button>
        </div>

        <div className="col-12">
          <label className="form-label d-flex justify-content-between">
            <span>Message *</span>
            <small className="text-muted">Maximum text length is 1000 characters</small>
          </label>
          <textarea 
            className="form-control" 
            name="message" 
            maxLength={1000} 
            rows={6} 
            value={form.message}
            onChange={e => setField("message", e.target.value)}
            required 
          />
          {status.errors.message && <small className="error">{status.errors.message}</small>}
        </div>

        {/* Address details toggle */}
        <div className="col-12 form-check my-2">
          <input 
            id="addressToggle" 
            className="form-check-input" 
            type="checkbox" 
            checked={showAddress}
            onChange={(e) => {
              setShowAddress(e.target.checked);
              setField("includeAddressDetails", e.target.checked);
            }}
          />
          <label className="form-check-label ms-2" htmlFor="addressToggle">Add address details</label>
        </div>

        {showAddress && (
          <div className="col-12">
            <div className="address-grid">
              <input 
                className="form-control" 
                placeholder="Address line 1" 
                name="address1" 
                value={form.addressDetails.addressLine1}
                onChange={e => setAddr("addressLine1", e.target.value)}
              />
              <input 
                className="form-control" 
                placeholder="Address line 2 - optional" 
                name="address2" 
                value={form.addressDetails.addressLine2}
                onChange={e => setAddr("addressLine2", e.target.value)}
              />
              <div className="row-compact">
                <input 
                  className="form-control" 
                  placeholder="City/Town" 
                  name="city" 
                  value={form.addressDetails.cityTown}
                  onChange={e => setAddr("cityTown", e.target.value)}
                />
                <input 
                  className="form-control" 
                  placeholder="State/County" 
                  name="state" 
                  value={form.addressDetails.stateCounty}
                  onChange={e => setAddr("stateCounty", e.target.value)}
                />
                <input 
                  className="form-control" 
                  placeholder="Postcode" 
                  name="postcode" 
                  value={form.addressDetails.postcode}
                  onChange={e => setAddr("postcode", e.target.value)}
                />
                <input 
                  className="form-control" 
                  placeholder="Country" 
                  name="country" 
                  value={form.addressDetails.country}
                  onChange={e => setAddr("country", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        <div className="col-12 mt-3">
          <button type="submit" className="btn btn-primary">
            <img src={IconSubmit} alt="" /> Submit
          </button>
        </div>
      </div>
    </form>
  );
}
