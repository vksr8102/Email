export const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString("en-US");
    const formattedTime = date.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit'  });
  
    return `${formattedDate} ${formattedTime}`;
  }