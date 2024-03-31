import { useEffect, useState } from "react";
import {
  getOrganizerApplicants,
  getAdministratorApplicants,
  respondOrganizerRequest,
  respondAdministratorRequest,
  getUser,
} from "../operations";
import NavPlaceholder from ".././assets/easy_way_out.png";
import "./AdminPage.css";
import { Button } from "@mui/material";

interface UserToken {
  token: string;
}

interface Applicant {
  created_at: string;
  id: number;
  is_accepted: boolean | null;
  user_id: string;
}

export default function AdminPage({ token }: UserToken) {
  const [usersApplyingOrg, setUserApplyingOrg] = useState<Applicant[]>([]);
  const [usersApplyingAdm, setUsersApplyingAdm] = useState<Applicant[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getOrganizerApplicants();
      setUserApplyingOrg(data || []);
    }
    async function fetchData2() {
      const data = await getAdministratorApplicants();
      setUsersApplyingAdm(data || []);
    }

    // bruh...
    fetchData();
    fetchData2();
  }, []);

  const fetchUsername = async (user_id: string) => {
    const userData = await getUser(user_id);
    console.log(userData);
    return userData.firstname + " " + userData.lastname;
  };

  const respondToAdminRequest = async (id: string, response: boolean) => {
    const user_id = id;
    const is_accepted = response;

    try {
      const data = await respondAdministratorRequest(user_id, is_accepted);

      const updatedList = usersApplyingAdm.filter(
        (applicant) => applicant.user_id !== user_id
      );
      setUsersApplyingAdm(updatedList);
    } catch (error) {
      console.error("Error responding to request:", error);
    }
  };

  const respondToOrgRequest = async (id: string, response: boolean) => {
    const user_id = id;
    const is_accepted = response;

    try {
      const data = await respondOrganizerRequest(user_id, is_accepted);

      const updatedList = usersApplyingOrg.filter(
        (applicant) => applicant.user_id !== user_id
      );
      setUserApplyingOrg(updatedList);
    } catch (error) {
      console.error("Error responding to request:", error);
    }
  };

  async function getUsername(uuid: string): Promise<string> {
    const finalData = await fetchUsername(uuid);
    return finalData;
  }
  return (
    <>
      <img src={NavPlaceholder} style={{ width: "100%" }} />
      <div className="content-container">
        <h1 className="section-header">User Applicants</h1>
        <p className="section-subheader">
          Users who applied for organizer or administrator will show up here.
        </p>

        <div className="applicant-container">
          {usersApplyingAdm.map((applicant) => (
            <div key={applicant.id} className="applicant-entry">
              <div className="applicant-info">
                <h3 className="applicant-name">{applicant.user_id}</h3>
                <p className="applicant-description">
                  is applying for Administrator role.
                </p>
              </div>
              <div className="applicant-response">
                <Button
                  variant="contained"
                  onClick={() => respondToAdminRequest(applicant.user_id, true)}
                >
                  Approve
                </Button>
                <Button
                  variant="contained"
                  onClick={() => respondToAdminRequest(applicant.user_id, null)}
                >
                  Deny
                </Button>
              </div>
            </div>
          ))}
          {usersApplyingOrg.map((applicant) => (
            <div key={applicant.id} className="applicant-entry">
              <div className="applicant-info">
                <h3 className="applicant-name">{applicant.user_id}</h3>
                <p className="applicant-description">
                  is applying for Organizer role.
                </p>
              </div>
              <div className="applicant-response">
                <Button
                  variant="contained"
                  onClick={() => respondToOrgRequest(applicant.user_id, true)}
                >
                  Approve
                </Button>
                <Button
                  variant="contained"
                  onClick={() => respondToOrgRequest(applicant.user_id, null)}
                >
                  Deny
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
