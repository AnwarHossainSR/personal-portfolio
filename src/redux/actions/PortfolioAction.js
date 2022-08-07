import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";

import { db, storage } from "../../utils/firebase";
import {
  portfolioFailure,
  portfolioPending,
  portfolioSuccess,
} from "../reducers/PortfolioSlice";

export const createPortfolioAction =
  (inputObject, file) => async (dispatch) => {
    dispatch(portfolioPending());
    try {
      const docRef = await addDoc(collection(db, "portfolios"), {
        ...inputObject,
        timestamp: serverTimestamp(),
      });
      const imageRef = ref(storage, `portfolios/${docRef.id}/image`);
      if (file !== null) {
        await uploadString(imageRef, file, "data_url").then(async () => {
          const downloadURL = await getDownloadURL(imageRef);
          await updateDoc(doc(db, "portfolios", docRef.id), {
            image: downloadURL,
          });
        });
      }
      dispatch(portfolioSuccess("Portfolio added successfully"));
    } catch (error) {
      dispatch(portfolioFailure(error.message));
    }
  };
