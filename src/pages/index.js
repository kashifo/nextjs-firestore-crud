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
    <div className="container">
      <header>
        <h1>Contact List</h1>
        <a href="/add">
          <button class="heading-button">Add Contact</button>
        </a>
      </header>

      <table>
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
                    <button>
                      <span className="icon-only">
                        <i className="fas fa-edit"></i>
                      </span>
                      <span className="text-only">Edit</span>
                    </button>
                  </Link>
                  <button onClick={() => handleDelete(item.id)} style={{ marginLeft: "10px" }}>
                    <span className="icon-only">
                      <i className="fas fa-trash-alt"></i>
                    </span>
                    <span className="text-only">Delete</span>
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
