import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Navbar, Nav } from "react-bootstrap";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { clearUserData } from "../store/userSlice";
import { ToastContainer, toast } from 'react-toastify';
import moment from "moment";
import { useNavigate } from "react-router-dom";

import "../CSS/dashboard.scss"


const Dashboard = () => {
    const navigate = useNavigate();
    const [documents, setDocuments] = useState([]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);

    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [Delete, setDeleted] = useState(false);



    const user = useSelector((state) => state.user.userData);

    const dispatch = useDispatch();

    //axios header 
    const config = {
        headers: {
            "refreshtoken": user.refreshtoken  // Set the header with the token
        }
    };

    let baseurl = import.meta.env.VITE_BASE_URL;

    // Handle file selection
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Handle document upload
    const handleUpload = async (e) => {
        e.preventDefault();

        if (!title || !description || !file) {
            setError("Please fill all fields and select a PDF file.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('description', description);

        try {
            const res = await axios.post(`${baseurl}/api/v1/file/upload`,
                formData,
                config)

            // console.log("response of file upload", res);
            toast.success("File uplaoded successfully.")
            setDeleted(true);
        } catch (error) {
            console.log("error in file uplaod", error)
        }

        // Clear fields and close modal
        setTitle("");
        setDescription("");
        setFile(null);
        setError("");
        setShowModal(false);
    };



    // get all files 
    useEffect(() => {

        // console.log("data from the redux", user);
        const fetchData = async () => {
            try {
                const res = await axios.get(`${baseurl}/api/v1/file/getfiles`, config);
                // console.log("response", res?.data?.data);
                setDocuments(res?.data?.data);
                setDeleted(false);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        // Call the inner async function
        fetchData();
    }, [Delete])

    // downlaod file 
    const downloadFile = async (documentId, fileName) => {
        try {
            const response = await axios.get(`${baseurl}/api/v1/file/downloadfile/${documentId}`, {
                responseType: "blob", // Ensure response is treated as a binary blob
                ...config
            });

            // Create a URL for the blob data
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName); // Use the correct filename
            document.body.appendChild(link);
            link.click();

            // Cleanup
            window.URL.revokeObjectURL(url);
        } catch (e) {

        }

    }

    // logout user 
    const logout = () => {
        dispatch(clearUserData());
        setTimeout(() => {

            toast.success("Logout successfully.");
        }, 1000);
        navigate("/");

    }

    const deleteFile = async (documentId) => {

        const isConfirmed = window.confirm('Are you sure you want to delete?');

        if (isConfirmed) {

            try {
                const res = await axios.delete(`${baseurl}/api/v1/file/deletefile/${documentId}`, config);
                // console.log("Document deleted successfully.", res)
                toast.success(res?.data?.message);
                setDeleted(true)
            } catch (error) {
                console.log("errro in delete", error)
            }
        }
    }

    return (

        <>
            {/* Navbar Fixed to Top */}


            <Navbar bg="white" variant="white" expand="lg" fixed="top" className="px-3 shadow">
                <Navbar.Brand className="akash">Document Dashboard</Navbar.Brand>
                <Nav className="ms-auto ">
                    <Button variant="success" className="m-2" onClick={() => setShowModal(true)}>
                        + Add Document
                    </Button>
                    <Button className="m-2" variant="danger" onClick={logout}>
                        Logout
                    </Button>
                </Nav>
            </Navbar>

            {/* Add padding to prevent content from hiding behind navbar */}
            <Container className="mt-5 pt-4">
                {/* Upload Document Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Upload Document</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleUpload}>
                            <Form.Group className="mb-3">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Upload PDF</Form.Label>
                                <Form.Control type="file" accept=".pdf" onChange={handleFileChange} required />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100">
                                Upload
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>

                <div>
                    <h4 className="mt-4">Uploaded Documents</h4>
                    <Row>
                        {documents.length === 0 ? (
                            <Col className="text-center">
                                <p>No documents uploaded yet.</p>
                            </Col>
                        ) : (
                            documents.map((doc) => (



                                <Col md={4} lg={3} sm={6} key={doc._id} className="mb-4">
                                    <Card style={{ width: '18rem' }}>
                                        <Card.Body>
                                            <Card.Title>Title: {doc.title}</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">Description: {doc.description}</Card.Subtitle>
                                            <Card.Text>
                                                <p><strong>File Name:</strong> {doc.name}</p>
                                                <p><strong>Size:</strong> {(doc.size / 1024).toFixed(2)} KB</p>
                                                <p><strong>Uploaded:</strong> {moment(doc.createdAt).format("YYYY-MM-DD HH:mm")}</p>

                                            </Card.Text>
                                            <Button
                                                variant="success"
                                                onClick={() => downloadFile(doc._id, doc.name)}
                                                className="w-100 my-1"
                                            >
                                                Download
                                            </Button>

                                            <Button
                                                variant="danger"
                                                onClick={() => deleteFile(doc._id)}
                                                className="w-100"
                                            >
                                                Delete
                                            </Button>

                                        </Card.Body>
                                    </Card>


                                </Col>
                            ))
                        )}
                    </Row>
                </div>
            </Container>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    );
};

export default Dashboard;
