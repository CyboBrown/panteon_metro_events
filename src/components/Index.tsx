import { useState } from "react";
//import { Link } from "react-router-dom";
import Link from "@mui/material/Link";
import { Stack } from "@mui/material";
import Button from '@mui/material/Button';
import './Index.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';

export default function Index() {
  
  const linkSX = {
    color: 'white',
  }

  const theme = createTheme({
    palette: {
      primary: {
        main: '#CAB535'
      },
      secondary: {
        main: '#35CAB5'
      }
    }
  })

  return (
    <>
      <ThemeProvider theme={theme}>
        <Container>
          <div className="title">
            <h1>Metro Events</h1>
          </div>
          <Stack 
            direction="row"
            spacing={2}
            justifyContent='center'
            sx={{paddingTop: 5}}>
            <Button variant="contained">
              <Link href="/signin" underline='none' sx={linkSX}>Sign in</Link>
            </Button>
            <Button variant="contained">
              <Link href="/signup" underline='none' sx={linkSX}>Sign up</Link>
            </Button>
          </Stack>
        </Container>
      </ThemeProvider>
    </>
  );
}
