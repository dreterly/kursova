import { BrowserRouter, Routes, Route } from "react-router-dom";

import { MainLoyout } from "./layouts/MainLoyout.jsx";

import { Home } from "./pages/Home.jsx";
import { Login } from "./pages/Login.jsx";
import { Register } from "./pages/Register.jsx";
import { Map } from "./pages/Map.jsx";
import { GPSMonitoring } from "./pages/GPSMonitoring.jsx";
import { LostPets } from "./pages/announcements/LostPets.jsx";
import { FoundPets } from "./pages/announcements/FoundPets.jsx";
import { AnnouncementDetails } from "./pages/announcements/AnnouncementDetails.jsx";
import { CreateAnnouncement } from "./pages/announcements/CreateAnnouncement.jsx";

import { EditAnnouncement } from "./pages/profile/EditAnnouncement.jsx";
import { Profile } from "./pages/profile/Profile.jsx";
import { AddPets } from "./pages/profile/AddPets.jsx";
import { PetProfile } from "./pages/profile/PetProfile.jsx";
import { MyAnnouncements } from "./pages/profile/MyAnnouncements.jsx";
import { Notifications } from "./pages/profile/Notifications.jsx";
import { Settings } from "./pages/profile/Settings.jsx";

import { AdminDashboard } from "./pages/admin/AdminDashboard.jsx";
import { AdminAnnouncements } from "./pages/admin/AdminAnnouncements.jsx";
import { EditAdminAnnouncement } from "./pages/admin/EditAdminAnnouncement.jsx";
import { AdminPets } from "./pages/admin/AdminPets.jsx";
import { EditAdminPet } from "./pages/admin/EditAdminPet.jsx";
import { AdminPetDetails } from "./pages/admin/AdminPetDetails.jsx";
import { AdminAnnouncementDetails } from "./pages/admin/AdminAnnouncementDetails.jsx";
import { AdminUsers } from "./pages/admin/AdminUsers.jsx";
import { EditAdminUser } from "./pages/admin/EditAdminUser.jsx";
import { AdminRoute } from "./components/AdminRoute.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Основний layout */}
        <Route element={<MainLoyout />}>
          {/* Публічні сторінки */}

          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/map" element={<Map />} />

          <Route path="/lost" element={<LostPets />} />

          <Route path="/found" element={<FoundPets />} />

          <Route path="/announcements/:id" element={<AnnouncementDetails />} />

          <Route path="/create-announcement" element={<CreateAnnouncement />} />
          <Route
            path="/gps"
            element={
              <ProtectedRoute>
                <GPSMonitoring />
              </ProtectedRoute>
            }
          />
          {/* Особистий кабінет */}

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/pets/add"
            element={
              <ProtectedRoute>
                <AddPets />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/pets/:id"
            element={
              <ProtectedRoute>
                <PetProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/announcements"
            element={
              <ProtectedRoute>
                <MyAnnouncements />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/announcements/edit/:id"
            element={
              <ProtectedRoute>
                <EditAnnouncement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Адмін-панель */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/announcements"
          element={
            <AdminRoute>
              <AdminAnnouncements />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/announcements/:id"
          element={
            <AdminRoute>
              <AdminAnnouncementDetails />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/announcements/edit/:id"
          element={
            <AdminRoute>
              <EditAdminAnnouncement />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/pets"
          element={
            <AdminRoute>
              <AdminPets />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/pets/:id"
          element={
            <AdminRoute>
              <AdminPetDetails />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/pets/edit/:id"
          element={
            <AdminRoute>
              <EditAdminPet />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users/edit/:id"
          element={
            <AdminRoute>
              <EditAdminUser />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
