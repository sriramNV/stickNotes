import { useEffect, useRef, useState } from "react";
import Trash from "../icons/Trash";
import { setNewOffset, autoGrow, setZIndex, bodyParser } from "../utils";
import { db } from "../appwrite/database";
import Spinner from "../icons/Spinner";
import DeleteButton from "../components/DeleteButton";
import { useContext } from "react";
import { NotesContext } from "../context/NotesContext";

const NoteCard = ({ note }) => {
    let mouseStartPos = { x: 0, y: 0 };
    const cardRef = useRef(null);

    const { setSelectedNote } = useContext(NotesContext);

    const [saving, setSaving] = useState(false);
    const { notes, setNotes } = useContext(NotesContext); 
    const keyUpTimer = useRef(null);

    const [position, setPosition] = useState(JSON.parse(note.position));
    const colors = JSON.parse(note.colors);
    const body = bodyParser(note.body);

    const textAreaRef = useRef(null);

    // useEffect(() => {
    //     autoGrow(textAreaRef);
    //     setZIndex(cardRef.current);
    // }, []);

    useEffect(() => {
        const cardHeaderElement = cardRef.current.querySelector('.card-header'); 
    
        const options = { passive: true }; // Add this line 
    
        cardHeaderElement.addEventListener('mousedown', mouseDown);
        cardHeaderElement.addEventListener('touchstart', mouseDown, options); 
    
        return () => {
            cardHeaderElement.removeEventListener('mousedown', mouseDown);
            cardHeaderElement.removeEventListener('touchstart', mouseDown, options);
        };
      }, []); 
    

    const mouseDown = (e) => {
        console.log("Mouse Down event:", e.type);
        if (e.target.className === "card-header") {
            // mouseStartPos.x = e.clientX;
            // mouseStartPos.y = e.clientY;
            
            if (e.type === 'mousedown') { // Mouse event
                mouseStartPos.x = e.clientX;
                mouseStartPos.y = e.clientY;
            } else if (e.type === 'touchstart') { // Touch event
                const touch = e.touches[0];
                mouseStartPos.x = touch.clientX;
                mouseStartPos.y = touch.clientY;
            }


            setZIndex(cardRef.current);

            // document.addEventListener("mousemove", mouseMove);
            // document.addEventListener("mouseup", mouseUp);
            // setSelectedNote(note);
            document.addEventListener("mousemove", mouseMove);
            document.addEventListener("mouseup", mouseUp);
            document.addEventListener("touchmove", mouseMove);
            document.addEventListener("touchend", mouseUp);
            setSelectedNote(note);
        }
    };

    const mouseMove = (e) => {
        console.log("Mouse Move event:", e.type);
        const mouseMoveDir = {
            x: mouseStartPos.x - e.clientX,
            y: mouseStartPos.y - e.clientY,
        };

        // mouseStartPos.x = e.clientX;
        // mouseStartPos.y = e.clientY;

        if (e.type.startsWith('touch')) {
            e.preventDefault();
            const touch = e.touches[0]; // Get the first touch point
            mouseStartPos.x = touch.clientX;
            mouseStartPos.y = touch.clientY;
        } else {
            // For mouse events, use the original logic
            mouseStartPos.x = e.clientX;
            mouseStartPos.y = e.clientY;
        }

        // const newPosition = setNewOffset(cardRef.current, mouseMoveDir);
        // setPosition(newPosition);
        if (e.type.startsWith('touch')) {
            e.preventDefault();
            const touch = e.touches[0]; 
            setPosition({
              x: touch.clientX, 
              y: touch.clientY
            });
          } else {
            setPosition({
              x: e.clientX,
              y: e.clientY
            });
          }
        
    };

    const mouseUp = async () => {
        // document.removeEventListener("mousemove", mouseMove);
        // document.removeEventListener("mouseup", mouseUp);

        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);
        document.removeEventListener("touchmove", mouseMove);
        document.removeEventListener("touchend", mouseUp);

        const newPosition = setNewOffset(cardRef.current);
        saveData("position", newPosition);

        const updatedNotes = notes.map(n => 
            n.$id === note.$id ? { ...n, position: JSON.stringify(newPosition) } : n
          );
          setNotes(updatedNotes);

    };

    const saveData = async (key, value) => {
        const payload = { [key]: JSON.stringify(value) };
        console.log("Save data called:", payload);
        try {
            await db.notes.update(note.$id, payload);
        } catch (error) {
            console.error(error);
        }
        setSaving(false);
    };

    const handleKeyUp = async () => {
        setSaving(true);
        if (keyUpTimer.current) {
            clearTimeout(keyUpTimer.current);
        }

        keyUpTimer.current = setTimeout(() => {
            console.log("Timer started");
            saveData("body", textAreaRef.current.value);
        }, 2000);
    };

    return (
        <div
            ref={cardRef}
            className="card"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                backgroundColor: colors.colorBody,
                
            }}
        >
            <div
                onMouseDown={mouseDown}
                className="card-header"
                style={{
                    backgroundColor: colors.colorHeader,
                }}
            >
                <DeleteButton noteId={note.$id} />

                {saving && (
                    <div className="card-saving">
                        <Spinner color={colors.colorText} />
                        <span style={{ color: colors.colorText }}>
                            Saving...
                        </span>
                    </div>
                )}
            </div>
            <div className="card-body">
                <textarea
                    onKeyUp={handleKeyUp}
                    onFocus={() => {
                        setZIndex(cardRef.current);
                        setSelectedNote(note);
                    }}
                    onInput={() => {
                        autoGrow(textAreaRef);
                    }}
                    ref={textAreaRef}
                    style={{ color: colors.colorText }}
                    defaultValue={body}
                ></textarea>
            </div>
        </div>
    );
};

export default NoteCard;