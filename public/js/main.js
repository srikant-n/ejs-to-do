let dragged;
let dragTarget = null;
let hasEnteredChildElement = false;

/**
 * Call to server to update data
 * @param {String} method put/push/delete
 * @param {Object} data   Data to send
 */
async function updateToServer(method, data) {
  const response = await fetch("/", {
    method: method,
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(data),
  });
}

/**
 * Listen for clicks on the list to check/uncheck and delete item
 */
document.getElementById("list").addEventListener("click", (event) => {
  if (event.target.type === "checkbox") {
    updateToServer("PUT", {
      type: "checked",
      index: Number(event.target.parentNode.id.substring(4)),
      isDone: event.target.checked,
    }).catch((e) => {
      console.log(e);
      event.target.checked = !event.target.checked;
    });
  } else if (event.target.className === "delete-item") {
    updateToServer("DELETE", {
      index: Number(event.target.parentNode.id.substring(4)),
    }).then((res) => event.target.parentNode.remove());
  }
});

document.addEventListener("dragstart", (event) => {
  // store a ref. on the dragged elem
  dragged = event.target;
  // make it half transparent
  event.target.style.opacity = 0.5;
});

document.addEventListener("dragend", (event) => {
  // reset the transparency
  event.target.style.opacity = "";
});

/* events fired on the drop targets */
document.addEventListener("dragover", (event) => {
  // prevent default to allow drop
  event.preventDefault();
});

document.addEventListener("dragenter", (event) => {
  const element = event.target == "item" ? event.target : event.target.parentNode;
  // highlight potential drop target when the draggable element enters it
  if (element.className == "item") {
    element.style.background = "#e1eaf1";
    dragTarget = element;
  }
});

document.addEventListener("dragleave", (event) => {
  const element = event.target == "item" ? event.target : event.target.parentNode;
  // reset background of potential drop target when the draggable element leaves it
  if (element.className == "item") {
    element.style.background = "";
  }
});

document.addEventListener("drop", (event) => {
  // prevent default action (open as link for some elements)
  event.preventDefault();
  if (dragTarget == null) return;
  const element = event.target == "item" ? event.target : event.target.parentNode;
  // move dragged elem to the selected drop target
  if (element.className == "item") {
    element.style.background = "";
    document.getElementById("old-index").value = Number(dragged.id.substring(4));
    document.getElementById("new-index").value = Number(dragTarget.id.substring(4));
    document.getElementById("reorder").submit();
    //updateToServer("PUT", {type:"reorder", oldIndex: Number(dragged.id.substring(4)), newIndex:Number(dragTarget.id.substring(4))});
    dragTarget = null;
  }
});
