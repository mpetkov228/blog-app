import { useSelector } from 'react-redux';

const Notification = () => {
  const notification = useSelector(state => state.notification);

  if (notification === '') {
    return null;
  }

  // const { message, type } = notification;

  const style = {
    backgroundColor: 'lightgrey',
    margin: '10px',
    padding: '10px',
    border: '2px solid',
    borderColor: 'green',
    borderRadius: '5px',
  };

  return (
    <div style={style}>
      {notification}
    </div>
  );
};

export default Notification;