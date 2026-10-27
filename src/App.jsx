import React, { useState } from "react";
import {
  ArrowLeft, ShieldCheck, ScanLine, Store, ChevronDown, ChevronRight,
  Home, History, UserRound, Check, X, CircleMinus, LoaderCircle,
  Sparkles, AlertTriangle, LockKeyhole, QrCode, WalletCards, Clock3
} from "lucide-react";
import "./index.css";

const DEMO_ACCOUNT = "Demo UPI account ••••4821";
const GOOD_CODE = "LENCY-DEMO-01";
const formatMoney = (n) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0
}).format(Number(n) || 0);

const starterActivity = [];

export default function App() {
  const [screen, setScreen] = useState("home");
  const [qrId, setQrId] = useState(GOOD_CODE);
  const [merchant, setMerchant] = useState("Asha Stores");
  const [amount, setAmount] = useState("1500");
  const [recipientName, setRecipientName] = useState("Asha Stores");
  const [accountName, setAccountName] = useState("Asha Stores");
  const [match, setMatch] = useState(true);
  const [activity, setActivity] = useState(starterActivity);
  const [selectedTx, setSelectedTx] = useState(null);
  const [notice, setNotice] = useState("");
  const [demoStarted, setDemoStarted] = useState(false);

  const go = (next) => { setNotice(""); setScreen(next); };
  const scan = () => {
    setQrId(GOOD_CODE); setMerchant("Asha Stores");
    setRecipientName("Asha Stores"); setAccountName("Asha Stores");
    setMatch(true); setNotice(""); go("scan");
  };
  const reviewPayment = () => go("review");
  const checkWithLency = () => {
    const trusted = ["LENCY-DEMO-01", "ASHA-STORES", "SAFE-QR"].includes(qrId.trim().toUpperCase());
    setMatch(trusted);
    setMerchant(trusted ? "Asha Stores" : "Pay Asha Stores");
    setRecipientName("Asha Stores");
    setAccountName(trusted ? "Asha Stores" : "Ravi Kumar");
    go("checking");
    window.setTimeout(() => go("match"), 650);
  };
  const continuePayment = () => go("confirm");
  const pay = () => {
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) { setNotice("Enter a valid demo amount."); return; }
    setNotice(""); setDemoStarted(true); go("processing");
    window.setTimeout(() => {
      const tx = {
        id: `DEMO-LCY-${Date.now().toString().slice(-8)}`,
        merchant: "Asha Stores", amount: value, date: "27 Oct 2026, 10:42 AM",
        status: "Payment successful", account: DEMO_ACCOUNT
      };
      setSelectedTx(tx); setActivity((old) => [tx, ...old]); go("success");
    }, 900);
  };
  const cancelPayment = () => go("cancelled");
  const headerTitle = {
    home: ["01 / PAYMENT HOME", "pocket"], scan: ["02 / SCAN QR", "Scan & pay"],
    review: ["03 / REVIEW", "Pay Asha Stores"], checking: ["04 / LENCY VERIFICATION", "Pay Asha Stores"],
    match: ["04 / LENCY VERIFICATION", "Pay Asha Stores"], confirm: ["07 / CONFIRM PAYMENT", "One last check"],
    processing: ["08 / PROCESSING STATE", "Processing payment"], success: ["08 / PAYMENT RESULT", "Payment result"],
    failed: ["08 / FAILED STATE", "Payment result"], cancelled: ["09 / PAYMENT CANCELLED", "Payment paused"],
    detail: ["10 / TRANSACTION DETAIL", "Demo receipt"], activity: ["11 / ACTIVITY", "Your activity"],
    profile: ["12 / PROFILE", "Your profile"]
  }[screen] || ["LENCY", "Pay with confidence"];

  return <div className="canvas">
    <div className="phone">
      <div className="statusbar"><span>10:42</span><span className="status-icons">▮▮ ▰ ▰</span></div>
      <header className="topbar">
        {screen !== "home" && screen !== "activity" && screen !== "profile" ?
          <button className="back" onClick={() => go(screen === "confirm" ? "match" : screen === "review" ? "scan" : "home")} aria-label="Back"><ArrowLeft size={15}/></button> :
          <span className="back placeholder"><ArrowLeft size={15}/></span>}
        <div className="heading"><span>{headerTitle[0]}</span><b>{headerTitle[1]}</b></div>
        <span className="demo-badge">✦ DEMO</span>
      </header>

      <main className="content">
        {screen === "home" && <>
          <div className="hello"><span>A little more clarity, every payment.</span><h1>Hello, Ananya <span className="avatar">AN</span></h1></div>
          <section className="account-card"><div className="account-top"><span>YOUR DEMO ACCOUNT</span><WalletCards size={12}/></div><h2>Ready for a test run</h2><p>Demo UPI account ••••4821</p><small><LockKeyhole size={10}/> A prototype space. No real money.</small></section>
          <button className="purple-button" onClick={scan}><ScanLine size={14}/> Scan & pay</button>
          <p className="caption centered">Start with the demo QR · Screen 2</p>
          <section className="meet-card"><div className="row-between"><b><ShieldCheck size={13}/> Meet Lency</b><span className="pill">✦ Name check</span></div><p>A moment to compare available names before you decide to pay. A match is not proof of identity.</p></section>
          <div className="section-title"><b>Your demo activity</b><span>TODAY</span></div>
          {activity.length ? activity.slice(0,2).map(tx => <ActivityRow key={tx.id} tx={tx} onClick={() => {setSelectedTx(tx);go("detail")}}/>) :
            <div className="activity-empty"><span className="tiny-icon"><QrCode size={14}/></span><div><b>Your first payment starts here</b><p>Scan, compare names, then choose.</p></div></div>}
        </>}

        {screen === "scan" && <>
          <div className="page-intro"><span>Position a QR inside the frame. For this demo, use the sample below.</span></div>
          <div className="qr-card"><div className="qr-label">DEMO CAMERA <QrCode size={11}/></div><div className="qr-art"><QRArt/><span className="qr-scanline"/></div><p>Sample QR · Asha Stores</p></div>
          <div className="info-banner"><ScanLine size={14}/><span>This scanner is simulated. It does not access your camera or read real payment codes.</span></div>
          <label className="label" htmlFor="qr">Demo QR ID</label><input id="qr" className="input" value={qrId} onChange={e=>setQrId(e.target.value)} />
          <div className="sample-links">Test <button onClick={()=>setQrId(GOOD_CODE)}>verified</button> · <button onClick={()=>setQrId("UNKNOWN-QR-99")}>name mismatch</button></div>
          <button className="purple-button" onClick={reviewPayment}><ScanLine size={13}/> Use demo QR</button>
          <p className="caption centered">Review recipient & amount · Screen 3</p>
          <button className="outline-button" onClick={()=>go("home")}>Back to home</button>
        </>}

        {screen === "review" && <>
          <div className="page-intro"><span>Check the details before you continue.</span></div>
          <div className="merchant-card"><div className="store-icon"><Store size={17}/></div><div className="merchant-name"><b>Asha Stores</b><span>asha.stores@demo</span></div><span className="verified-mini">✦ DEMO</span><div className="send-label">You're sending</div><strong>{formatMoney(amount)}</strong></div>
          <div className="account-line"><span>PAYING FROM</span><button onClick={()=>setNotice(notice ? "" : "Demo account selected. No bank connection is active.")}>{DEMO_ACCOUNT}<ChevronDown size={12}/></button></div>
          {notice && <div className="info-banner">{notice}</div>}
          <div className="info-banner lavender"><ShieldCheck size={14}/><span>Lency will compare the QR display name with the available account name. You stay in control.</span></div>
          <button className="purple-button push-bottom" onClick={checkWithLency}><ShieldCheck size={14}/> Check with Lency</button>
          <p className="caption centered">Name check · Screen 4</p><p className="caption centered">Demo only. No money moves.</p>
        </>}

        {(screen === "checking" || screen === "match") && <>
          <div className="page-intro"><span>Check the name before you pay.</span></div>
          <div className="merchant-card compact-merchant"><div className="store-icon"><Store size={17}/></div><div className="merchant-name"><b>Asha Stores</b><span>asha.stores@demo</span></div><span className="verified-mini">✦ DEMO</span><div className="send-label">You're sending</div><strong>{formatMoney(amount)}</strong></div>
          <div className="account-line"><span>PAYING FROM</span><b>{DEMO_ACCOUNT}</b></div>
          <div className="bottom-sheet">
            <div className="sheet-handle"/>
            <div className="sheet-brand"><span className="lency-mark"><ShieldCheck size={13}/></span><b>Lency</b><span className="pill">✦ SIMULATED CHECK</span></div>
            {screen === "checking" ? <div className="checking"><LoaderCircle className="spin" size={26}/><b>Comparing names...</b><p>Checking the demo QR against the available account information.</p></div> :
              <>
                <div className={match ? "result-title" : "result-title warn"}>{match ? <Check size={16}/> : <X size={16}/>}<b>{match ? "Available names match" : "These names don’t match"}</b></div>
                <p className="sheet-copy">{match ? "The QR name and available account name are both Asha Stores. This is a name match only." : "The QR says Asha Stores, but the available account name is different. Pause before paying."}</p>
                <div className={match ? "name-compare" : "name-compare warning"}><div><span>QR display name</span><b>Asha Stores</b></div><div><span>Available account name</span><b>{accountName}</b></div></div>
                <p className="fine-print">Matching names do not prove the recipient is genuine or that a payment is safe.</p>
                {match ? <button className="purple-button" onClick={continuePayment}>Continue to payment</button> : <button className="purple-button" onClick={cancelPayment}>Cancel payment</button>}
                <button className="outline-button" onClick={cancelPayment}>{match ? "Cancel payment" : "Continue with warning"}</button>
              </>}
            <p className="sheet-foot">Cancel · Screen 5 · Demo only, no money moved</p>
          </div>
        </>}

        {screen === "confirm" && <>
          <div className="page-intro"><h1>Ready to make a demo payment?</h1><span>You decide whether to continue. Nothing will be sent from a real account.</span></div>
          <div className="receipt-card"><div className="merchant-row"><div className="store-icon"><Store size={17}/></div><div><b>Asha Stores</b><span>asha.stores@demo</span></div></div><div className="receipt-line"><span>Demo amount</span><strong>{formatMoney(amount)}</strong></div><div className="receipt-line"><span>Payment method</span><b>{DEMO_ACCOUNT}</b></div><div className="receipt-line"><span>Demo fee</span><b>₹0</b></div></div>
          <div className="info-banner lavender"><ShieldCheck size={14}/><span>A name match is not proof of identity. If you see a mismatch, stop and verify with the recipient.</span></div>
          {notice && <p className="error">{notice}</p>}
          <button className="purple-button" onClick={pay}><LockKeyhole size={13}/> Pay {formatMoney(amount)} in demo</button><p className="caption centered">Processing & result · Screen 8</p>
          <button className="outline-button" onClick={cancelPayment}>Cancel payment</button>
        </>}

        {screen === "processing" && <div className="result-page"><div className="result-symbol processing-symbol"><LoaderCircle className="spin" size={28}/></div><h1>Processing your<br/>payment...</h1><span className="pill">✦ SIMULATED PROCESSING</span><p>Demo only. No money moved.</p><div className="receipt-card mini"><div className="receipt-line"><span>Recipient</span><b>Asha Stores</b></div><div className="receipt-line"><span>Demo amount</span><b>{formatMoney(amount)}</b></div><div className="receipt-line"><span>Payment method</span><b>{DEMO_ACCOUNT}</b></div></div><div className="progress-track"><span/></div></div>}

        {screen === "success" && <div className="result-page"><div className="result-symbol success-symbol"><Check size={30}/></div><h1>Payment successful</h1><span className="pill green-pill">✦ SIMULATED SUCCESS</span><p>Demo only. No money moved.</p><strong className="big-amount">{formatMoney(selectedTx?.amount || amount)}</strong><span className="to-merchant">to Asha Stores</span><div className="receipt-card mini"><div className="receipt-line"><span>Date & time</span><b>{selectedTx?.date}</b></div><div className="receipt-line"><span>Payment method</span><b>{DEMO_ACCOUNT}</b></div><div className="receipt-line"><span>Fictional transaction ID</span><b>{selectedTx?.id}</b></div></div><button className="purple-button" onClick={()=>go("detail")}>View transaction details</button><button className="outline-button" onClick={()=>go("home")}>Back to home</button></div>}

        {screen === "failed" && <div className="result-page"><div className="result-symbol failed-symbol"><X size={29}/></div><h1>Payment could not be<br/>completed</h1><span className="pill red-pill">✦ SIMULATED FAILURE</span><p>Demo only. No money moved.</p><div className="receipt-card mini"><div className="receipt-line"><span>Recipient</span><b>Asha Stores</b></div><div className="receipt-line"><span>Amount</span><b>{formatMoney(amount)}</b></div><div className="receipt-line"><span>Payment method</span><b>{DEMO_ACCOUNT}</b></div></div><p className="muted-center">The demo couldn't finish this payment. Your account was not charged.</p><button className="purple-button" onClick={()=>go("confirm")}>Try again</button><button className="outline-button" onClick={()=>go("home")}>Back to home</button></div>}

        {screen === "cancelled" && <div className="result-page"><div className="result-symbol cancelled-symbol"><CircleMinus size={28}/></div><h1>Payment paused</h1><span className="pill">✦ SIMULATED CANCELLATION</span><p>You chose not to continue with this payment.</p><p className="muted-center strong">No payment completed in this demo.</p><div className="receipt-card mini"><div className="receipt-line"><span>Recipient</span><b>Asha Stores</b></div><div className="receipt-line"><span>Amount</span><b>{formatMoney(amount)}</b></div><div className="receipt-line"><span>QR display name</span><b>Asha Stores</b></div><div className="receipt-line"><span>Available account name</span><b>{accountName}</b></div></div><p className="muted-center">It's okay to pause when something doesn't look right.</p><button className="purple-button" onClick={()=>go("home")}>Return to home</button><button className="outline-button" onClick={scan}>Scan another QR</button></div>}

        {screen === "detail" && <><div className="detail-status"><Check size={13}/> Payment successful <span className="pill green-pill">✦ SIMULATED</span></div><strong className="detail-amount">{formatMoney(selectedTx?.amount || amount)}</strong><span className="muted-right">No money moved</span><div className="receipt-card mini"><div className="receipt-line"><span>Recipient</span><b>Asha Stores</b></div><div className="receipt-line"><span>UPI ID</span><b>asha.stores@demo</b></div><div className="receipt-line"><span>Payment method</span><b>{DEMO_ACCOUNT}</b></div><div className="receipt-line"><span>Date & time</span><b>{selectedTx?.date || "27 Oct 2026, 10:42 AM"}</b></div><div className="receipt-line"><span>Fictional transaction ID</span><b>{selectedTx?.id || "DEMO-LCY-20261026-0042"}</b></div></div><div className="lency-summary"><b><ShieldCheck size={13}/> Lency verification summary</b><p>QR name: Asha Stores</p><p>Available account name: {accountName}</p><p className="good-text">Available names match in this demo. Name match only — not proof of identity.</p><small>Lency checks available information but cannot guarantee that a recipient is genuine or a payment is risk-free.</small></div><button className="purple-button push-bottom" onClick={()=>go("home")}>Back to home</button></>}

        {screen === "activity" && <><h1>Your demo<br/>activity</h1>{activity.length ? activity.map(tx=><ActivityRow key={tx.id} tx={tx} onClick={()=>{setSelectedTx(tx);go("detail")}}/>) : <div className="empty-state"><History size={25}/><b>No transactions yet</b><p>Your demo activity will appear here after a simulated payment.</p></div>}<button className="purple-button" onClick={scan}>Scan another QR</button></>}
        {screen === "profile" && <><h1>Your profile</h1><div className="account-card profile-card"><div className="avatar large">AN</div><h2>Ananya</h2><p>Demo user · Prototype mode</p></div><div className="info-banner"><LockKeyhole size={14}/><span>This prototype does not connect to a bank account or store payment credentials.</span></div><button className="outline-button" onClick={()=>go("home")}>Back to home</button></>}
      </main>

      {["home","activity","profile"].includes(screen) && <nav className="bottom-nav">
        <button className={screen==="home"?"nav-item active":"nav-item"} onClick={()=>go("home")}><Home size={15}/><span>Home</span></button>
        <button className={screen==="activity"?"nav-item active":"nav-item"} onClick={()=>go("activity")}><History size={15}/><span>Activity</span></button>
        <button className={screen==="profile"?"nav-item active":"nav-item"} onClick={()=>go("profile")}><UserRound size={15}/><span>Profile</span></button>
      </nav>}
      <div className="home-indicator"><span/></div>
    </div>
  </div>;
}

function ActivityRow({tx, onClick}) {
  return <button className="activity-row" onClick={onClick}><span className="tiny-icon"><Store size={14}/></span><span className="activity-text"><b>{tx.merchant}</b><small>{tx.date}</small><em><span/> {tx.status}</em></span><strong>{formatMoney(tx.amount)}</strong></button>;
}
function QRArt() {
  return <div className="qr-grid" aria-label="Decorative demo QR code">
    {Array.from({length: 81},(_,i)=><i key={i} className={[0,1,2,3,4,9,13,18,19,20,21,22,27,31,36,37,38,39,40,44,46,48,50,52,54,56,58,60,62,64,66,68,70,72,74,76,78,80].includes(i)?"dark":""}/>)}
    <div className="qr-finder one"/><div className="qr-finder two"/><div className="qr-finder three"/>
  </div>;
}
