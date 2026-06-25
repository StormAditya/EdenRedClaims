import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Home, Users, FileText, LogOut } from "lucide-react";

const Sidebar = ({ user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
}
