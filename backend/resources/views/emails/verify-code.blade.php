<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Email Verification</title>
  </head>
  <body style="background:#f4f4f4;padding:20px;font-family:Arial,sans-serif;">
    <div
      style="
        max-width:500px;
        margin:auto;
        background:#ffffff;
        padding:30px;
        border-radius:8px;
        box-shadow:0 2px 10px rgba(0,0,0,.05);
        text-align:center;
      "
    >
      <p style="text-align:left; font-size:22px; margin-bottom:10px; margin-left:10px;">Hi, {{$user->full_name}}</p>
      <h3 style="margin-bottom:10px; color:#111;">Verify your email</h3>

      <p style="color:#555; font-size:14px;">Use the verification code below to confirm your email address.</p>

      <div
        style="
          margin:20px 0;
          font-size:28px;
          font-weight:bold;
          letter-spacing:6px;
          color:#111;
        "
      >
        {{$code}}
      </div>

      <p style="font-size:13px; color:#777;">This code will expire in <strong>10 minutes</strong>.</p>

      <hr style="margin:25px 0; border:none; border-top:1px solid #eee;" />

      <p style="font-size:12px; color:#999;">If you didn&apos;t request this, you can safely ignore this email.</p>
    </div>
  </body>
</html>
