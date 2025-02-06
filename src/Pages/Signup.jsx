import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card, Alert, InputGroup } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';


function Signup() {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name,setName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [response,setResponse]=useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        // Validation for password match
        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        let baseurl = import.meta.env.VITE_BASE_URL;
        // console.log("url", baseurl+"/v1/user/register")

        
        try {
            const res = await axios.post(`${baseurl}/api/v1/user/register`,
                {   name:`${name}`,
                    email: `${email}`,
                    password: `${confirmPassword}`
                }
            )

            // console.log("response |",res);
            setResponse(res);
        } catch (error) {
            console.error(error);
        }

        setError("");
        // console.log("User Signed Up:", { email, password });

        if(response?.status == 201){

            setTimeout(() => {
                
                toast.success("Signup Successful! Redirecting to Login...")
            }, 2000);

            // alert("Signup Successful! Redirecting to Login...");
            navigate("/login");
        }else{
            alert("Error in sign up", response)
        }
    };



    return (

        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Row>
                <Col>
                    <Card className="shadow-lg p-4 rounded" style={{ width: 500 }}>
                        <Card.Title className="text-center mb-3">Sign Up</Card.Title>

                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleSignup}>
                            <Form.Group className="mb-3 text-start">
                                <Form.Label className="fw-bold">Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your Name "
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            {/* Email Field */}
                            <Form.Group className="mb-3 text-start">
                                <Form.Label className="fw-bold">Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your Email "
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            {/* Password Field */}
                            <Form.Group className="mb-3 text-start">
                                <Form.Label className="fw-bold">Password</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        placeholder="Enter your password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeSlash /> : <Eye />}
                                    </Button>
                                </InputGroup>
                            </Form.Group>

                            {/* Confirm Password Field */}
                            <Form.Group className="mb-3 text-start">
                                <Form.Label className="fw-bold">Confirm Password</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        placeholder="Confirm your password"
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeSlash /> : <Eye />}
                                    </Button>
                                </InputGroup>
                            </Form.Group>

                            <Button variant="success" type="submit" className="w-100">
                                Sign Up
                            </Button>
                        </Form>

                        <div className="text-center mt-3">
                            <p>
                                Already have an account? <a href="/login">Login</a>
                            </p>
                        </div>
                    </Card>
                </Col>
            </Row>
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
        </Container>

    )
}

export default Signup