import React from "react";

export const BiometricSetup = () => {
  return <div>BiometricSetup</div>;
};

// aggiungere check uguale a pinSetup

//           const pendingInvite = sessionStorage.getItem("inviteToken");
//           if (pendingInvite) {
//             sessionStorage.removeItem("inviteToken");
//             axiosInstance
//               .get(`${GROUP_URL}/accept-invite/${pendingInvite}`)
//               .then((res) => navigate(`/group/${res.data.groupId}`))
//               .catch(() => navigate(DocReminderRoutes.home));
//             return;
//           }
