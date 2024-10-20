import Plus from '../icons/Plus';
import colors from '../assets/colors.json';
import { NotesContext } from '../context/NotesContext';
import { useContext, useRef } from 'react';
import { db } from '../appwrite/database';

const AddButton = () => {
    const { setNotes } = useContext(NotesContext);

    const startingPos = useRef(10);

    const addNote = async () => {
        const payload = {
            position: JSON.stringify({
                x: startingPos.current,
                y: startingPos.current,
            }),
            colors: JSON.stringify(colors[0]),
        };
        startingPos.current += 10;

        const response = await db.notes.create(payload);
        setNotes((prevState) => [response, ...prevState]);
    }


    return(
        <div id='add-button'>
            <Plus />
        </div>
    );
};

export  default AddButton