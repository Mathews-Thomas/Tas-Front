import { useNavigate } from 'react-router-dom';

const SimpleModal = ({ showModal, onClose }) => {
    const navigate = useNavigate();

    if (!showModal) {
        return null;
    }

    const handleClose = () => {
        onClose();
        navigate('/login');
    };

    return (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', zIndex: 1000 }}>
            <h2>Authentication Error</h2>
            <p>Branch login failed. Please log in through the branch first.</p>
            <button onClick={handleClose}>Okay</button>
        </div>
    );
};

export default SimpleModal;
