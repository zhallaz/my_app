import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Chip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  phoneNumber?: string;
  address?: string;
}

const API_BASE_URL = "https://students-learning-api.onrender.com/api/auth";

const UsersTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_BASE_URL, axiosConfig);

      console.log("All users response:", response.data);

      const result = response.data;

      if (Array.isArray(result)) {
        setUsers(result);
      } else if (Array.isArray(result.users)) {
        setUsers(result.users);
      } else if (Array.isArray(result.data)) {
        setUsers(result.data);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);

    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      address: user.address || "",
    });

    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedUser(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      setLoading(true);
      setError("");

      const userId = selectedUser._id;

      const response = await axios.patch(`${API_BASE_URL}/${userId}`, formData, axiosConfig);

      console.log("Update response:", response.data);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId
            ? {
                ...user,
                ...formData,
              }
            : user,
        ),
      );

      handleCloseEdit();
    } catch (err) {
      console.error(err);
      setError("Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");

    if (!confirmDelete) return;

    try {
      setLoading(true);
      setError("");

      await axios.delete(`${API_BASE_URL}/delete/${id}`, axiosConfig);

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Paper
        elevation={8}
        sx={{
          p: 3,
          borderRadius: 4,
          background: "#ffffff",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 3,
            color: "#0f172a",
          }}
        >
          Users
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading && users.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 5,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e5e7eb",
              overflowX: "auto",
            }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    background: "#0f172a",
                  }}
                >
                  <TableCell sx={{ color: "#fff", fontWeight: 700 }}>First Name</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Last Name</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Email</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Phone Number</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Address</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Admin</TableCell>
                  <TableCell align="center" sx={{ color: "#fff", fontWeight: 700 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user._id} hover>
                      <TableCell>{user.firstName}</TableCell>
                      <TableCell>{user.lastName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phoneNumber || "N/A"}</TableCell>
                      <TableCell>{user.address || "N/A"}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.isAdmin ? "Admin" : "User"}
                          color={user.isAdmin ? "success" : "default"}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <IconButton color="primary" onClick={() => handleOpenEdit(user)}>
                          <EditIcon />
                        </IconButton>

                        <IconButton color="error" onClick={() => handleDeleteUser(user._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog open={openEdit} onClose={handleCloseEdit} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>Edit User</DialogTitle>

        <DialogContent>
          <TextField
            label="First Name"
            name="firstName"
            fullWidth
            margin="normal"
            value={formData.firstName}
            onChange={handleChange}
          />

          <TextField
            label="Last Name"
            name="lastName"
            fullWidth
            margin="normal"
            value={formData.lastName}
            onChange={handleChange}
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
          />

          <TextField
            label="Phone Number"
            name="phoneNumber"
            fullWidth
            margin="normal"
            value={formData.phoneNumber}
            onChange={handleChange}
          />

          <TextField
            label="Address"
            name="address"
            fullWidth
            margin="normal"
            multiline
            minRows={2}
            value={formData.address}
            onChange={handleChange}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseEdit} variant="outlined">
            Cancel
          </Button>

          <Button onClick={handleUpdateUser} variant="contained" disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersTable;
