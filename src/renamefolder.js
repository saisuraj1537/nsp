import { db } from "./firebaseConfig.js";
import { ref, get, set, remove } from "firebase/database";

const userId = "9866395959"; // User ID from Firebase Database
const oldModulePath = `users/${userId}/drone_module/module1`;
const newModulePath = `users/${userId}/drone_module/fundamentals`;

// Step 1: Read data from old module
get(ref(db, oldModulePath)).then((snapshot) => {
  if (snapshot.exists()) {
    const data = snapshot.val();

    // Step 2: Write data to new module
    set(ref(db, newModulePath), data).then(() => {
      
      // Step 3: Delete the old module
      remove(ref(db, oldModulePath)).then(() => {
        console.log("Module renamed successfully!");
      }).catch((error) => {
        console.error("Error deleting old module:", error);
      });

    }).catch((error) => {
      console.error("Error writing to new module:", error);
    });

  } else {
    console.log("Old module does not exist");
  }
}).catch((error) => {
  console.error("Error reading old module:", error);
});
