import { useState } from "react";

import { DndContext, closestCorners, useSensor, useSensors, PointerSensor, TouchSensor, KeyboardSensor, DragOverlay, useDroppable } from "@dnd-kit/core"
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { restrictToWindowEdges } from '@dnd-kit/modifiers';

// restrictToWindowEdges - to prevent dragging outside the window


export default function App() {
  const [activeId, setActiveId] = useState(null)
  const [arrayDays, setArrayDays] = useState({ // task arrays
    "11.11.2011": [
      { id: "task-1", text: "Task 1 for 11.11.2011" },
      { id: "task-2", text: "Task 2 for 11.11.2011" },
      { id: "task-3", text: "Task 3 for 11.11.2011" }
    ],
    "12.11.2011": [
      { id: "task-4", text: "Task 1 for 12.11.2011" },
      { id: "task-5", text: "Task 2 for 12.11.2011" },
      { id: "task-6", text: "Task 3 for 12.11.2011" }
    ],
    "13.11.2011": [
      { id: "task-7", text: "Task 1 for 13.11.2011" },
      { id: "task-8", text: "Task 2 for 13.11.2011" },
      { id: "task-9", text: "Task 3 for 13.11.2011" }
    ]
  })

  const sensors = useSensors(
    useSensor(PointerSensor),  // mouse or stylus
    useSensor(TouchSensor),    // touchscreen (mobile)
    useSensor(KeyboardSensor)  // keyboard (optional)
  );
  function Day({id, tasks}){
    // useDroppable to make day a droppable container
    const { setNodeRef } = useDroppable({id: id, data: {isDay: true}})
    return (
      // SortableContext enables sorting of tasks inside a day
      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        <div className="day" ref={setNodeRef}>{tasks.map(el => <Item key={el.id} id={el.id} text={el.text}/>)}</div>
      </SortableContext>
    )
  }

  function Item({ id, text }){
    // useSortable provides drag and drop attributes and listeners for a task item
    const { attributes, listeners, setNodeRef, transform, transition,} = useSortable({id: id});
  
    const styles = {
      transform: CSS.Translate.toString(transform),
      transition,
    }
    let isActive = activeId === id

    // add 'dragging' class if this item is currently being dragged
    return <div ref={setNodeRef} style={styles} {...attributes} {...listeners} className={`item${isActive ? " dragging" : ""}`}>{text}</div>
  }



  // find the date (key) of the day containing the task with given id
  function findTaskDate(id){
    for(let key in arrayDays){
      if(arrayDays[key].some(el => el.id === id)) return key
    }
    console.info("The task was not found, maybe is a day component?")
  }

  // handle drag start event, set the active dragged id
  function handleDragStart({ active }){
    setActiveId(active.id)
  }

  // handle dragging over another droppable or sortable element
  function handleDragOver({ active, over }) {
    if (!over) return;
  
    const activeDate = findTaskDate(active.id);
    const overDate = findTaskDate(over.id);
  
    if (activeDate === overDate) return;
  
    const activeIndex = arrayDays[activeDate].findIndex(el => el.id === active.id);

    const newArrayDays = { ...arrayDays };
    if(over.data.current.isDay){ // if the target is a day container (empty or day itself)
      // Remove task from active day (mutate array)
      const [movedTask] = newArrayDays[activeDate].splice(activeIndex, 1);
      // Add the moved task to the end of the new day
      newArrayDays[over.id].push(movedTask)
      return
    }

    const overIndex = arrayDays[overDate].findIndex(el => el.id === over.id);
  
    // Remove task from active day (mutate array)
    const [movedTask] = newArrayDays[activeDate].splice(activeIndex, 1);
  
    // Insert task into new day at position of the task being hovered over
    newArrayDays[overDate].splice(overIndex, 0, movedTask);
  
    setArrayDays(newArrayDays);
  }

  // handle drag end event, finalize the move
  function handleDragEnd({ active, over }){
    setActiveId(null)
    if(!over) return
    const activeDate = findTaskDate(active.id)
    const overDate = findTaskDate(over.id)
    const activeIndex = arrayDays[activeDate].findIndex(el => el.id === active.id)
    const overIndex = arrayDays[overDate].findIndex(el => el.id === over.id)

    console.log(activeDate , overDate, " | ", activeIndex, overIndex)
    const newArrayDays = {...arrayDays}

    if(activeDate === overDate){ // if moved inside the same day
      newArrayDays[activeDate] = arrayMove(arrayDays[activeDate], activeIndex, overIndex)
    }
    setArrayDays(newArrayDays)
  }
  

  return (
    <>
      <div className="parrent">
      <DndContext collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver} modifiers={[restrictToWindowEdges]} sensors={sensors}>
        {Object.keys(arrayDays).map(key => <Day key={key} id={key} tasks={arrayDays[key]}/>)}
        <DragOverlay>
        {activeId && <Item text={arrayDays[findTaskDate(activeId)].find(el => el.id === activeId).text}/>}
      </DragOverlay>
      </DndContext>
      </div>
    </>
  )
}
