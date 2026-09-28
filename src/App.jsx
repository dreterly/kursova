
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { MainLoyout } from "./layouts/MainLoyout.jsx";

import { Home } from "./pages/Home.jsx";
import { Login } from "./pages/Login.jsx";
import { Register } from "./pages/Register.jsx";
import { Map } from "./pages/Map.jsx";

import { LostPets } from "./pages/announcements/LostPets.jsx";
import { FoundPets } from "./pages/announcements/FoundPets.jsx";
import { AnnouncementDetails } from "./pages/announcements/AnnouncementDetails.jsx";
import { CreateAnnouncement } from "./pages/announcements/CreateAnnouncement.jsx";

import { Profile } from "./pages/profile/Profile.jsx";
import { AddPets } from "./pages/profile/AddPets.jsx";
import { PetProfile } from "./pages/profile/PetProfile.jsx";
import { MyAnnouncements } from "./pages/profile/MyAnnouncements.jsx";
import { Notifications } from "./pages/profile/Notifications.jsx";
import { Settings } from "./pages/profile/Settings.jsx";

import { AdminDashboard } from "./pages/admin/AdminDashboard.jsx";
import { AdminAnnouncements } from "./pages/admin/AdminAnnouncements.jsx";
import { AdminPets } from "./pages/admin/AdminPets.jsx";
import { AdminUsers } from "./pages/admin/AdminUsers.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<MainLoyout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/map" element={<Map />} />

          <Route path="/lost" element={<LostPets />} />
          <Route path="/found" element={<FoundPets />} />

          <Route
            path="/announcements/:id"
            element={<AnnouncementDetails />}
          />

          <Route
            path="/create-announcement"
            element={<CreateAnnouncement />}
          />

          <Route path="/profile" element={<Profile />} />

          <Route
            path="/profile/pets/add"
            element={<AddPets />}
          />

          <Route
            path="/profile/pets/:id"
            element={<PetProfile />}
          />

          <Route
            path="/profile/announcements"
            element={<MyAnnouncements />}
          />

          <Route
            path="/profile/notifications"
            element={<Notifications />}
          />

          <Route
            path="/profile/settings"
            element={<Settings />}
          />
        </Route>

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/announcements"
          element={<AdminAnnouncements />}
        />

        <Route
          path="/admin/pets"
          element={<AdminPets />}
        />

        <Route
          path="/admin/users"
          element={<AdminUsers />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;