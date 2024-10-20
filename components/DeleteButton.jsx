import Trash from "../icons/Trash";
import { db } from "../appwrite/database";
import { NotesContext } from "../context/NotesContext";
import { useContext } from "react";

const DeleteButton = ({ noteID}) => {
    const {setNotes} = useContext(NotesContext);
    // const handleDelete = async (e) => {
    //     db.notes.delete(noteID);
    //     setNotes(
    //         (prevState) => prevState.filter((note) => note.$id !== noteID)
    //     );
    // };

    // return(
    //     <div onClick={handleDelete}><Trash /></div>
    // );
}

export default DeleteButton;