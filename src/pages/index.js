import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function Home() {
  const [items, setItems] = useState([]);

  // Fetch items from Firestore
  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, "contacts"));
      const fetchedItems = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(fetchedItems);
    };

    fetchItems();
  }, []);

  // Handle delete
  const handleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;
  
    try {
      // Delete the document from Firestore
      console.log('delete:', id);
      const docRef = doc(db, "contacts", id);
      await deleteDoc(docRef);
  
      // Update the local state to remove the deleted item
      setItems(items.filter((item) => item.id !== id));
      alert("Contact deleted successfully!");
    } catch (error) {
      console.error("Error deleting Contact:", error);
      alert("Failed to delete the Contact. Please try again.");
    }
  };

  return (
    <div>
      <h1>Contact List</h1>
      <Link href="/add">
        <button style={{ marginBottom: "20px" }}>Add Item</button>
      </Link>
      <table border="1" cellPadding="10" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan="3">No Contacts found.</td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.phone}</td>
                <td>
                  <Link href={`/edit/${item.id}`}>
                    <button>Edit</button>
                  </Link>
                  <button onClick={() => handleDelete(item.id)} style={{ marginLeft: "10px" }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
