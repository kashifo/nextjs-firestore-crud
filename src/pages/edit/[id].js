import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useRouter } from "next/router";

export default function Edit() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      const docRef = doc(db, "contacts", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name);
        setPhone(data.phone);
      } else {
        alert("No such contact!");
      }
    };

    fetchItem();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const docRef = doc(db, "contacts", id);
    await updateDoc(docRef, { name, phone });
    alert("Contact updated!");
    router.push("/"); // Redirect to homepage
  };

  return (
    <div className="container">
      <header>
        <h1>Edit Contact</h1>
      </header>
      <center>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <br />
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <br />
          <button type="submit">Add</button>
        </form>
      </center>
    </div>
  );
}
