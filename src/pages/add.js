import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useRouter } from "next/router";

export default function Add() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "contacts"), { name, phone });
    alert("Contact added!");
    router.push("/"); // Redirect to homepage
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Add Contact</h1>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <br />
      <textarea
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      ></textarea>
      <br />
      <button type="submit">Add</button>
    </form>
  );
}
