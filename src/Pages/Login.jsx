
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';

import { useDispatch } from "react-redux";
import { setUserData } from "../store/userSlice";
import bgimg from "../assets/bgImage.jpg"

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        // console.log("Login Clicked:", { email, password });
        let baseurl = import.meta.env.VITE_BASE_URL;
        // console.log(baseurl)

        let response;
        try {
            response = await axios.post(`${baseurl}/api/v1/user/login`,
                {
                    email: `${email}`,
                    password: `${password}`
                }
            )
            // console.log(response);
        } catch (error) {
            console.error("error", error);
        }


        // Replace this with your actual authentication logic
        if (response?.status == 200) {

            const userData = {
                "email": email,
                "acessToken": response?.data?.data?.acessToken,
                "refreshtoken": response?.data?.data?.refreshToken
            }



            dispatch(setUserData(userData));
            toast.success("Login Successful!")
            console.log("toastis showing ")

            setTimeout(() => {
                navigate("/dashboard");

            }, 2000);
        } else {
            toast.error("Login Successful!")
            // alert("Invalid Credentials", response);

        }
    };

    const loginStyle = {
        backgroundImage: bgimg,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };

    return (

        <>
            <Container style={loginStyle}  className="d-flex justify-content-center align-items-center ">
                <Row>
                    <Col>
                        <Card className="shadow-lg p-4 rounded " style={{ width: 500 }} >
                            <Card.Title className=" mb-3 ">Login</Card.Title>
                            <Form onSubmit={handleLogin}>

                                <Form.Group className="mb-3 text-start">
                                    <Form.Label className="fw-bold">Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group  >

                                <Form.Group className="mb-3 text-start">
                                    <Form.Label className="fw-bold">Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100">
                                    Login
                                </Button>
                            </Form>

                            <div className="text-center mt-3">
                                <p>
                                    Don't have an account? <a href="/signup">Sign up</a>
                                </p>
                            </div>
                        </Card>
                    </Col>
                </Row>
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

export default Login;
