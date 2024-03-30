import { useState } from "react";
//import { Link } from "react-router-dom";
import Link from "@mui/material/Link";
import { Stack } from "@mui/material";
import Button from '@mui/material/Button';
import './Index.css';

export default function Index() {
  
  const linkSX = {
    color: 'black',
  }

  const buttonSX = {
    background: '#F5F5DC'
  }

  return (
    <>
      <div className="title">
        <h1>Metro Events</h1>
      </div>
      <Stack 
        direction="row"
        spacing={2}
        justifyContent='center'
        sx={{paddingTop: 5}}>
        <Button variant="contained" sx={buttonSX}>
          <Link href="/signin" underline='none' sx={linkSX}>Sign in</Link>
        </Button>
        <Button variant="contained" sx={buttonSX}>
          <Link href="/signup" underline='none' sx={linkSX}>Sign up</Link>
        </Button>
      </Stack>
    </>
  );
}
