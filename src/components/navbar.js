import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { NETWORK } from "../config";
import * as web3 from "@solana/web3.js";
import { getEventListeners } from "stream";

export default function Navbar({}) {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [backButton, setBackButton] = useState(false);
  const provider = useWallet();

  const connection = new Connection(clusterApiUrl(NETWORK), "singleGossip");

  const location = useLocation();

  useEffect(() => {
    console.log("***************location changed ", location);
    if (location.pathname === "/play") setBackButton(true);
    else setBackButton(false);
  }, [location]);

  useEffect(() => {
    fetchBalance();
  }, [provider]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Call your function here
      fetchBalance();
    }, 3000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  const fetchBalance = async () => {
    try {
      if (provider?.publicKey === null) return;
      const publicKey = provider.publicKey;
      const balance = await connection.getBalance(publicKey);
      setBalance(balance / 1000000000); // convert lamports to SOL and set state

      // // Airdrop some SOL to the sender's wallet, so that it can handle the txn fee
      // var airdropSignature = await connection.requestAirdrop(
      //   provider.publicKey,
      //   web3.LAMPORTS_PER_SOL,
      // );

      // // Confirming that the airdrop went through
      // await connection.confirmTransaction(airdropSignature);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          width: "100vw",
          height: { xs: "60px", sm: "80px", md: "150px" },
          backgroundColor: "#FFC700",
          padding: { xs: "0 10px", sm: "0 20px" },
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: "1",
          "& .MuiBox-root": {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          },
        }}
      >
        <Box
          sx={{
            cursor: "pointer",
            "& img": {
              height: { xs: "36px", sm: "42px", md: "90px" },
            },
          }}
          onClick={() => {
            navigate("/");
          }}
        >
          <img alt="" src="./logo192.png" />
          <Typography
            sx={{
              display: { xs: "none", sm: "flex" },
              fontSize: { sm: "24px", md: "40px" },
              fontWeight: "400",
              color: "white",
            }}
          >
            SOLARPS
          </Typography>
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: { xs: "14px", sm: "18px", md: "32px" },
              fontWeight: "600",
              color: "black",
            }}
          >
            {balance} SOL
          </Typography>
          <Box
            sx={{
              marginLeft: { xs: "10px", sm: "20px", md: "30px" },
              "& .wallet-adapter-button": {
                width: { xs: "140px", sm: "180px", md: "285px" },
                height: { xs: "42px", sm: "48px", md: "65px" },
                borderRadius: "10px",
                background: "black",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                color: "white",
                fontSize: { xs: "14px", sm: "18px", md: "25px" },
                fontWeight: "600",
              },
            }}
          >
            <WalletMultiButton />
          </Box>
          {/* <Button
            sx={{
              width: "285px",
              height: "65px",
              marginLeft: "36px",
              borderRadius: "10px",
              background: "black",
              color: "white",
              fontSize: "25px",
              fontWeight: "600",
              textTransform: "none",
              "&:hover": {
                background: "black",
              },
            }}
          >
            Wallet Connect
          </Button> */}
        </Box>
      </Box>
      <Box
        sx={{
          position: "fixed",
          width: { xs: "100px", md: "154px" },
          height: { xs: "42px", md: "64px" },
          borderRadius: "10px",
          left: { xs: "10px", md: "36px" },
          bottom: "20px",
          backgroundColor: "#FFC700",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          zIndex: "1",
          "& .MuiIconButton-root": {
            width: { xs: "42px", md: "64px" },
            aspectRatio: "1",
            backgroundSize: "cover",
          },
        }}
      >
        <IconButton
          sx={{
            background: "url(./images/twitter.png)",
          }}
        />
        <IconButton
          sx={{
            marginLeft: "5px",
            background: "url(./images/discord.png)",
          }}
        />
      </Box>
      <Button
        sx={{
          display: backButton ? "block" : "none",
          position: "fixed",
          width: { xs: "120px", md: "220px" },
          height: { xs: "42px", md: "65px" },
          right: { xs: "10px", md: "36px" },
          bottom: "20px",
          borderRadius: "10px",
          border: "5px solid #FFC700",
          fontSize: { xs: "14px", md: "25px" },
          fontWeight: "600",
          color: "black",
          textTransform: "none",
          zIndex: "1",
        }}
        onClick={() => {
          navigate("/");
        }}
      >
        Back
      </Button>
    </>
  );
}
