const AWS = require('aws-sdk');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
var request = require('request');
const { Console } = require('console');
const crypto = require('crypto');

// !AWS S3 (TOKEN)
const s3 = new AWS.S3({
  accessKeyId: 'AKIAVXAMGX2X7CXRN7WK', // !ID
  secretAccessKey: 'skFWQLalczItTbBK42njJ7M7nzR89E6lkhLENgtC', // !Key
  region: 'us-east-2', // I recommend not to change and configure your AWS to this region. (Optional)
  signingAlgorithm: 'v4' // Adds this property to specify the signature algorithm.
});
global.BucketNameAWS = 'sidhu5555'; // !Bucket Name in AWS S3

// !Chegg Cookies
const cookies = ['CVID=306f2f86-0413-4a52-bccb-ad60c900c3ed; _pxvid=856fcf0d-2b12-11ee-bf55-be3c069567dd; _ga=GA1.2.276691552.1690306908; _gcl_au=1.1.1970490779.1690306909; _fbp=fb.1.1690306909077.335658816; _cs_c=0; C=0; O=0; sbm_country=IN; _cc_id=f36babacde27c72db7be44984f92d837; OneTrustWPCCPAGoogleOptOut=true; _tt_enable_cookie=1; _ttp=3ztR1PeBmcQVXJ-O2rY-ImtmvXm; _scid=974907ae-7f1f-4029-9f25-007da8af354c; __pdst=61b4cb52412c4b40ae133767ebee5164; V=c11fc845de1cbf9c4bf22b7c1dd1f01564c409fe795810.79127676; _pubcid=5ee2e99a-34dc-4ffd-8a4e-09905b017a81; pbjs-unifiedid=%7B%22TDID%22%3A%222e405279-b3e2-4999-bb5d-475077a55ffc%22%2C%22TDID_LOOKUP%22%3A%22TRUE%22%2C%22TDID_CREATED_AT%22%3A%222023-06-30T06%3A43%3A09%22%7D; _awl=2.1690785823.5-e0e2bed2905e95baa26202f5dfd76255-6763652d617369612d6561737431-0; usprivacy=1YYY; _rdt_uuid=1691861760643.db78a883-dae7-41db-b7c3-536787cd8387; country_code=IN; pxcts=ac0eea56-44f1-11ee-a980-54647773507a; local_fallback_mcid=48045889178324986616579357306848859491; s_ecid=MCMID|48045889178324986616579357306848859491; mcid=48045889178324986616579357306848859491; IR_gbd=chegg.com; _sctr=1%7C1693074600000; _vid_t=ZUc2L0fHAjSTyZaxTsgHg24pNZd6CzCSWDrWL2+QRs23e8JM8nEeJXdnnHKQT17dqeDmH6WsPPi4HI2DRIhwsTAwiQ==; opt-user-profile=306f2f86-0413-4a52-bccb-ad60c900c3ed%252C24080330904%253A24091301300%252C23891332498%253A23883763193%252C24639721375%253A24652680260%252C23981852979%253A24076260022%252C24407410763%253A24380760516; _gid=GA1.2.82268378.1693507345; ln_or=eyI4ODQyMzUiOiJkIn0%3D; _sp_id.ad8a=3a8155ef-7a05-4985-a2a1-25afe96c69d0.1690307038.11.1693546571.1693507697.f8807b02-bf6a-4495-a4c6-353b9c363988; user_geo_location=%7B%22country_iso_code%22%3A%22IN%22%2C%22country_name%22%3A%22India%22%2C%22region%22%3A%22UP%22%2C%22region_full%22%3A%22Uttar+Pradesh%22%2C%22city_name%22%3A%22Lucknow%22%2C%22postal_code%22%3A%22226002%22%2C%22locale%22%3A%7B%22localeCode%22%3A%5B%22en-IN%22%2C%22hi-IN%22%2C%22gu-IN%22%2C%22kn-IN%22%2C%22kok-IN%22%2C%22mr-IN%22%2C%22sa-IN%22%2C%22ta-IN%22%2C%22te-IN%22%2C%22pa-IN%22%5D%7D%7D; panoramaId_expiry=1693632988738; panoramaId=690385590022296932684e29cee5a9fb927aa8cb28bcb5e8258989eadde8663e; panoramaIdType=panoDevice; CSID=1693587490008; schoolapi=a0d6a450-d19b-4c30-801e-190a6092a499|0.333333333; userData=%7B%22authStatus%22%3A%22Hard%20Logged%20In%22%2C%22email%22%3A%22cheggsilver53%2Bchegg%40gmail.com%22%2C%22attributes%22%3A%7B%22cheggUserUUID%22%3A%22f1c4b873-3416-4364-b12e-1cfc29079785%22%2C%22uvn%22%3A%22c11fc845de1cbf9c4bf22b7c1dd1f01564c409fe795810.79127676%22%7D%7D; PHPSESSID=00pa4ata8u22uqnalrvf1l87b0; exp=C026A; expkey=6C3E0AA7F27C50FEDED9014F019551B1; sbm_a_b_test=1-control; __gads=ID=d22f93096120d793:T=1690306914:RT=1693587515:S=ALNI_Ma97ZWB8Rd3eqiP1E2v8B-tsFVZwQ; __gpi=UID=00000d1b7b844375:T=1690306914:RT=1693587515:S=ALNI_MZCYsuP8XS3WZC_N-alC3qhCjI2og; ftr_blst_1h=1693587530491; forterToken=d403ab3891ea460998b54e8e1262049e_1693587529596__UDF43-m4_13ck; chgmfatoken=%5B%20%22account_sharing_mfa%22%20%3D%3E%201%2C%20%22user_uuid%22%20%3D%3E%20b6e13d92-54a5-4588-a45d-d7d1b618f6ef%2C%20%22created_date%22%20%3D%3E%202023-09-01T17%3A01%3A10.443Z%20%5D; id_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNoZWdnc2lsdmVyNTNAZ21haWwuY29tIiwiaXNzIjoiaHViLmNoZWdnLmNvbSIsImF1ZCI6IkNIR0ciLCJpYXQiOjE2OTM1ODc2OTAsImV4cCI6MTcwOTEzOTY5MCwic3ViIjoiYjZlMTNkOTItNTRhNS00NTg4LWE0NWQtZDdkMWI2MThmNmVmIiwicmVwYWNrZXJfaWQiOiJhcHciLCJjdHlwIjoiaWQifQ.oRq3U7TG_RH9hFaK-H_KplWqRvRzFmhqprrmXDaK1ZMePQQ6CPQurWswR-wPefwyBu2Ky4H6bZtBsQMZva4YshQzzh0wyPQagzSo0bFJZT1BOe6W6iObOj8yMAeEgXfHZe6w3G0sFOnoTo7o4E9RtJ4nsprc81b7IondIp-WCy4zErJF6GLMp3-8xezLW9MIToocPDkL6LatOdC9xf24T92ddi0SoKrGTvcnPgmxg-ZvX5CZPT5Xf6JpGu_GYzb2h7nLIWGsEnzdUn_Gb0MVoDa7-da0E8hrLWXydDu-AbHnf3QyfNwDCeqT-GjaRgPfmApEOqjIlNS_FsqUDnalgA; access_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodWIuY2hlZ2cuY29tIiwic3ViIjoiYjZlMTNkOTItNTRhNS00NTg4LWE0NWQtZDdkMWI2MThmNmVmIiwiYXVkIjpbInRlc3QtY2hlZ2ciLCJodHRwczovL2NoZWdnLXByb2QuY2hlZ2cuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY5MzU4NzY5MCwiZXhwIjoxNjkzNTg5MTMwLCJhenAiOiJGaXBqM2FuRjRVejhOVVlIT2NiakxNeDZxNHpWS0VPZSIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgYWRkcmVzcyBwaG9uZSBvZmZsaW5lX2FjY2VzcyIsImd0eSI6InBhc3N3b3JkIiwicmVwYWNrZXJfaWQiOiJhcHciLCJjaGdocmQiOnRydWUsImNoZ21mYSI6dHJ1ZSwiaHR0cHM6Ly9wcm94eS5jaGVnZy5jb20vY2xhaW1zL2FwcElkIjoiQ0hHRyIsImN0eXAiOiJhY2Nlc3MifQ.XOmXee8ZdoN4GKWB_eMBi2GJ39ojBPmcKU7nxaWA6Jy9VVG4cdNDee3Pqy7Za59OaNggJGl7j0WbMEWRIM91JESrqy9qY47toquIQoo9RG3673olHod72ef0cpQ8yep042tKzSmvrcHSb0U0yIJfC-a1k4xwXQxudJn3NNOr1rsZxPn22U5-jTRv8QAjLgut8Q-0TZtvtozRmgbKQoxXT5NS5kfWnxy_fGPdvYUiuvRdT_VRhuj_m-Sf1mi9Bjwlf2cVodyGO_n25CQAiywBpZvAFahNQDK-1qHsfoarkedwPoNNt3dfoc67N6s7-KgZRk9fpU4zqjxQyc2vQFdaMA; CSessionID=1796f928-d53d-4551-a932-44dc688bb334; SU=Yl45V7Ba6oT1KfaInQRuyBvXiiA6b3W42xKUY97pE8fagILsBB1b5nFr7mc5fQ--P0ycNr80icQVPlDlkgHt7T5tCbrTgsvBWzQpJr12Z2U6wvWSYeTAZXK2Up3pd7TG; _sdsat_cheggUserUUID=b6e13d92-54a5-4588-a45d-d7d1b618f6ef; ab.storage.deviceId.b283d3f6-78a7-451c-8b93-d98cdb32f9f1=%7B%22g%22%3A%22a0c73320-cb7a-04d8-97c3-f7f86e76ea65%22%2C%22c%22%3A1690306996717%2C%22l%22%3A1693587694692%7D; ab.storage.userId.b283d3f6-78a7-451c-8b93-d98cdb32f9f1=%7B%22g%22%3A%22b6e13d92-54a5-4588-a45d-d7d1b618f6ef%22%2C%22c%22%3A1693587694686%2C%22l%22%3A1693587694694%7D; _gat=1; DFID=web|McYH3BnW2tXcZCspbz0P; U=0; chgcsdmtoken=b6e13d92-54a5-4588-a45d-d7d1b618f6ef++web|McYH3BnW2tXcZCspbz0P++1693587716162; _pxff_tm=1; _sdsat_authState=Hard%20Logged%20In; _scid_r=974907ae-7f1f-4029-9f25-007da8af354c; OptanonConsent=isGpcEnabled=0&datestamp=Fri+Sep+01+2023+22%3A32%3A03+GMT%2B0530+(India+Standard+Time)&version=6.39.0&isIABGlobal=false&hosts=&consentId=2e075394-1f5d-42fe-b721-2a9c02d3f9bd&interactionCount=1&landingPath=NotLandingPage&groups=fnc%3A1%2Csnc%3A1%2Ctrg%3A1%2Cprf%3A1&AwaitingReconsent=false; _px3=e0fefa8949957f51d99b5b789d725c13f1f6d663811f2b38f25e1de94debdd37:w7mLupbcYLPm9nXRG3pglY2mwOEhbkMVSsYYvTUfZjX9TGZkmx13T+P68S89M0T0SHmYEINdSk5mi/JhyX7rEw==:1000:cQuLzNR8fppKNWlc86mYhBKxzdEOgzhsfEYxcXb7/eJDRZOUh5x6SLCi7fWk8/06YivUR/XAzzPjnoLJ73R8NEGYpekZlrdcuhzWxFdhTH2uiwXfJojlvxMsEPW4NG74yk1nwaQ1kzt+Ss3gOng8ha5OXkoX9Buk25WB4d/YoMrs3fIj8lp/iPA96uwR1G5IT0Aa4xq5XAO70qiYiTkEGg==; _px=w7mLupbcYLPm9nXRG3pglY2mwOEhbkMVSsYYvTUfZjX9TGZkmx13T+P68S89M0T0SHmYEINdSk5mi/JhyX7rEw==:1000:ZQG7+EgZWSp1A5oQi5z8rQR2vb+ALsm/qCCirEAw2MkBsBCeKWydM9wdXEeVy07KoIoxkB3q9/mTLSCjsb8t29ReVgxmCBBlq1fb8m1x8a+Y3yHudWnKCS3uK5KSIFrxsiPmwChDu8kwIT5gY+/EhcuHz/75YZmMX3abvhlZnb+YIgYZX5cFPhSRbL1g5Kjh1FZUByySnhfEaaW4Ml6Ud8gsplcnpLMDrp90KIfOHv9rM7NCpk4aH3ckMSgKCcN0gqwjGrEof4XNV/XcC9zi0Q==; ab.storage.sessionId.b283d3f6-78a7-451c-8b93-d98cdb32f9f1=%7B%22g%22%3A%22a687d305-03ff-5953-edc2-ae91e2a1d619%22%2C%22e%22%3A1693589524944%2C%22c%22%3A1693587694690%2C%22l%22%3A1693587724944%7D; _tq_id.TV-8145726354-1.ad8a=dce79ffb912cef56.1690306910.0.1693587725..; IR_14422=1693587725185%7C0%7C1693587725185%7C%7C; _uetsid=21018810482e11eeb0965bba75b7de70; _uetvid=88aca6602b1211ee97e529a4ac05995c; _cs_cvars=%7B%221%22%3A%5B%22Page%20Name%22%2C%22home%20page%22%5D%2C%222%22%3A%5B%22Experience%22%2C%22desktop%22%5D%2C%223%22%3A%5B%22Page%20Type%22%2C%22core%22%5D%7D; _cs_id=2db66e2d-8442-a4b8-c38c-936861211a96.1690306909.41.1693587726.1693587481.1.1724470909833; _cs_s=9.0.0.1693589526018; _ga_ZBG6WLWXBE=GS1.2.1693587503.26.1.1693587726.32.0.0; _pxde=f66b91d8b7ff0d456bc449bd75a84116e1606da8012775102648686007aa4b0e:eyJ0aW1lc3RhbXAiOjE2OTM1ODc3MjY5NTZ9'];

var headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0',
  'Accept': '*/*, application/json',
  'Accept-Language': 'en-US,en;q=0.5',
  'Accept-Encoding': 'gzip, deflate, br',
  'Referer': 'https://www.chegg.com/',
  'content-type': 'application/json',
  'apollographql-client-name': 'chegg-web',
  'apollographql-client-version': 'main-5df873cd-4034069560',
  'Authorization': 'Basic TnNZS3dJMGxMdVhBQWQwenFTMHFlak5UVXAwb1l1WDY6R09JZVdFRnVvNndRRFZ4Ug==',
  'Origin': 'https://www.chegg.com',
  'Connection': 'keep-alive',
  'Cookie': `${cookies[Math.floor(Math.random() * cookies.length)]}`, // !Choose a Cookie at random.
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-site',
  'TE': 'trailers'
};

const url_MongoDB = 'mongodb+srv://zz:zz@cluster0.7oqai.mongodb.net/zz?retryWrites=true&w=majority'; // !Mongo DB LINK
const cliente = new MongoClient(url_MongoDB);

const token = '6361144529:AAFzRnQqxxatMp3m5qLJ-Cmv_UTd5n2tDRg'; // !Token Bot.
const bot = new TelegramBot(token, {polling: true});
const AdminID = 5603074381; // !Admin ID
const channelId = '-1001952406639'; // !Channel ID
const chat_id = -1001659164919; // !Group ID
const BuySubscription = "https://t.me/s_9_s_6"; // !Admin Link
const PointPrices = "https://t.me/hsjzjakki"; // !Price List Link (Channel or Group).
const Channel = "https://t.me/gzhzjod"; // !Channel Link
const Group = "https://t.me/hsjzjakki"; // !Group Link

const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

app.get(["/", "/:name"], (req, res) => {
  greeting = "<h1>Hello, code written by Ninja!</h1>";
  name = req.params["name"];
  if (name) {
    res.send(greeting + "</br>and hello to " + name);
  } else {
    res.send(greeting);
  }
});

app.listen(port, () => console.log(`Hello Node app Listening on Port ${port}!`));

bot.onText(/\/echo (.+)/, (msg, match) => { // Command /echo
  //console.log(msg);
  const chatId = msg.chat.id;
  const resp = match[1]; // Captura el mesaje despues del comando.
  bot.sendMessage(chatId, resp);
});
bot.onText(/\/get/, async (msg) => { // Command /get
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  try {
    const chatMember = await bot.getChatMember(channelId, userId);
    if (chatMember.status === 'member' || chatMember.status === 'administrator' || chatMember.status === 'creator') {
      const puntos = 1; // !Points to Add for New Users
      const dias_sub = 2; // !Days to Add New Users
      const id_user = msg.from.id;
      const username_user = msg.from.username;
      const today = new Date();
      await cliente.connect();
      const database = cliente.db('dbtelegram');
      const collection = database.collection('usuarios');
      const query = { id_user: id_user };
      const resultt = await collection.findOne(query);
      let now, fecha_fin,dias,puntos_sub;
      if (resultt) {
        now = new Date();
        fecha_fin = resultt.fecha_fin;
        const diffInMs = Math.abs(fecha_fin - now);
        dias = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)); 
        puntos_sub = resultt.puntos;
        await cliente.close();
        await bot.sendMessage(chatId, `Remaining  Chances: ${puntos_sub}\n\nYour points expire after:\n${dias} Day/s⏱⏳\n---------\n`, {reply_to_message_id: msg.message_id});
      } else {
        const newUser = {
          id_user: id_user,
          username_user: username_user,
          fecha_ini: new Date(),
          fecha_fin: new Date(today.setDate(today.getDate() + dias_sub)),
          puntos: puntos
        };
        await collection.insertOne(newUser);
        await cliente.close();
        await bot.sendMessage(chatId, `Remaining  Chances: ${puntos}\n\nYour points expire after:\n${dias_sub} Day/s⏱⏳\n---------\n`, {reply_to_message_id: msg.message_id});
      }
    } else {
      const btnText = 'ALKRAR';
      const btnUrl = Channel;
      const btn = {
        text: btnText,
        url: btnUrl
      };
      const options = {
        reply_markup: {
          inline_keyboard: [
            [btn]
          ]
        },
        reply_to_message_id: msg.message_id
      };
      await bot.sendMessage(chatId, 'You must subscribe to the channel to use the bot.', options);
    }
  } catch (error) {
    console.error(error);
    await bot.sendMessage(chatId, 'An error occurred while verifying the subscription, please contact the group administrator to help you.',{reply_to_message_id: msg.message_id});
  }
  
});
bot.onText(/\/add (.+) (.+)/, async (msg, match) => { // Command /add [Points] [Dias]
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  try {
    const chatMember = await bot.getChatMember(channelId, userId);
    if (chatMember.status === 'member' || chatMember.status === 'administrator' || chatMember.status === 'creator') {
      //console.log(msg);
      const message_id = msg.message_id;
      // Verificar si el usuario que envió el mensaje tiene permiso
      if (userId !== AdminID) {
        await bot.sendMessage(chatId, 'Sorry, you do not have permission to use this command.', {reply_to_message_id: msg.message_id});
        return;
      }  
      // Si el usuario tiene permiso, continuar con el comando
      const puntos_add = parseInt(match[1]);
      const dias_add = parseInt(match[2]);
      // Resto del código aquí...
      const id = msg.reply_to_message.from.id;
      const username = msg.reply_to_message.from.username;

      await cliente.connect();
      const database = cliente.db('dbtelegram');
      const collection = database.collection('usuarios');
      const query = { id_user: id };
      const resultt = await collection.findOne(query);
      let now, fecha_fin,dias,puntos_sub;
      if (resultt) {
        const today = new Date();
        const updateDoc = {
          $set: {
            id_user: id,
            username_user: username,
            fecha_ini: new Date(),
            fecha_fin: new Date(today.setDate(today.getDate() + dias_add)),
            puntos: puntos_add
          }
        };
        await collection.updateOne(query, updateDoc);
        await cliente.close();
        await bot.sendMessage(chatId, `Remaining  Chances: ${puntos_add}\n\nYour points expire after:\n${dias_add} Day/s⏱⏳\n---------\n${new Date(today.setDate(today.getDate() + dias_add))}`, {reply_to_message_id: msg.message_id});
      } else {
        const today = new Date();
        const newUser = {
          id_user: id,
          username_user: username,
          fecha_ini: new Date(),
          fecha_fin: new Date(today.setDate(today.getDate() + dias_add)),
          puntos: puntos_add
        };
        await collection.insertOne(newUser);
        await cliente.close();
        await bot.sendMessage(chatId, `Remaining  Chances: ${puntos_add}\n\nYour points expire after:\n${dias_add} Day/s⏱⏳\n---------\n${new Date(today.setDate(today.getDate() + dias_add))}`, {reply_to_message_id: msg.message_id});
      }
    } else {
      const btnText = 'ALKRAR';
      const btnUrl = Channel;
      const btn = {
        text: btnText,
        url: btnUrl
      };
      const options = {
        reply_markup: {
          inline_keyboard: [
            [btn]
          ]
        },
        reply_to_message_id: msg.message_id
      };
      await bot.sendMessage(chatId, 'You must subscribe to the channel to use the bot.', options);
    }
  } catch (error) {
    console.error(error);
    await bot.sendMessage(chatId, 'An error occurred while verifying the subscription, please contact the group administrator to help you.',{reply_to_message_id: msg.message_id});
  }
  
});
bot.onText(/\/prices/, async (msg) => { // Command /prices
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  try {
    const chatMember = await bot.getChatMember(channelId, userId);
    if (chatMember.status === 'member' || chatMember.status === 'administrator' || chatMember.status === 'creator') {
      const btnText = 'See Prices 💱';
      const btnUrl = PointPrices;
      const btn = {
        text: btnText,
        url: btnUrl
      };
      const options = {
        reply_markup: {
          inline_keyboard: [
            [btn]
          ]
        },
        reply_to_message_id: msg.message_id,
      };
      await bot.sendMessage(chatId, `💰 Click the button to see an up-to-date price list of our plans and any updates to the group. 💳\n`,options);
    } else {
      const btnText = '🤖 Ninja Channel 🥷';
      const btnUrl = Channel;
      const btn = {
        text: btnText,
        url: btnUrl
      };
      const options = {
        reply_markup: {
          inline_keyboard: [
            [btn]
          ]
        },
        reply_to_message_id: msg.message_id
      };
      await bot.sendMessage(chatId, 'You must subscribe to the channel to use the bot.', options);
    }
  } catch (error) {
    console.error(error);
    await bot.sendMessage(chatId, 'An error occurred while verifying the subscription, please contact the group administrator to help you.',{reply_to_message_id: msg.message_id});
  }
  
});
bot.on('message', async (msg) => { // Link Detection
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const messageText = msg.text;
  try {
    const chatMember = await bot.getChatMember(channelId, userId);
    if (chatMember.status === 'member' || chatMember.status === 'administrator' || chatMember.status === 'creator') {
      if (msg.chat.type === 'supergroup' && msg.chat.id === chat_id){
        // Analizar mensajes que llegan al grupo. 
        const linkRegex = /(https?:\/\/[^\s]+)/g;
        const links = messageText.match(linkRegex);
        if (links) {
          const url_chegg = links[0]; // Captura el enlace del mensaje.
          await cliente.connect();
          const database = cliente.db('dbtelegram');
          const collection = database.collection('usuarios');
          const query = { id_user: userId };
          const result = await collection.findOne(query);
          if (result) {
            const fechaFutura = result.fecha_fin;
            const fechaActual = new Date();
            const diferenciaEnMilisegundos = fechaFutura - fechaActual;
            const dias = Math.floor(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24));
            //console.log(dias);
            const puntos = result.puntos;
            if (fechaFutura >= fechaActual) {
              if (puntos > 0) {
                if (url_chegg.startsWith('https://www.chegg.com/homework-help/questions-and-answers/')) {
                  console.log('Expert Q&A');
                  const regex = /q(\d+)/;
                  const match = url_chegg.match(regex);
                  const numero = match[1];
                  //console.log(numero);
                  var dataString = `{"operationName":"QnaPageAnswer","variables":{"id":${numero}},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"36b39e8909e7d00003f355ca4d38bab164fcf06a68a2fb433a3f1138ffb1e5b7"}}}`;
                  var options = {
                    url: 'https://gateway.chegg.com/one-graph/graphql',
                    method: 'POST',
                    headers: headers,
                    gzip: true,
                    body: dataString
                };
                function callback(error, response, body) {
                  if (!error && response.statusCode == 200) {
                    const json_request = body;
                    //console.log(json_request);
                    const obj = JSON.parse(json_request);
                    var authorFirstName,authorFirstName,authorNickname,authorAnswerCount,answerHtml,legacyId;
                    try {
                      legacyId = obj.data.questionByLegacyId.displayAnswers.htmlAnswers[0].legacyId;
                      authorFirstName = obj.data.questionByLegacyId.displayAnswers.htmlAnswers[0].answerData.author.firstName;
                      authorFirstName = obj.data.questionByLegacyId.displayAnswers.htmlAnswers[0].answerData.author.lastName;
                      authorNickname = obj.data.questionByLegacyId.displayAnswers.htmlAnswers[0].answerData.author.nickname;
                      authorAnswerCount = obj.data.questionByLegacyId.displayAnswers.htmlAnswers[0].answerData.author.answerCount;
                      answerHtml = obj.data.questionByLegacyId.displayAnswers.htmlAnswers[0].answerData.html;

                    } catch (error) {
                      legacyId = null;
                      authorFirstName = null;
                      authorLastName = null;
                      authorNickname = null;
                      authorAnswerCount = null;
                      try {
                        answerHtml = obj.data.questionByLegacyId.displayAnswers.htmlAnswers[0].answerData.html;
                      } catch (error) {
                        //console.log(error);
                        const objeto = JSON.parse(json_request);
                        //console.log(objeto);
                        const respuesta = objeto.data.questionByLegacyId.displayAnswers.sqnaAnswers.answerData[0].body.text;
                        //console.log(respuesta);
                        const objetoo = JSON.parse(respuesta);
                        data = objetoo;
                        //console.log(objetoo);
                        const answer = data.finalAnswer.blocks[0].block.editorContentState.blocks[0].text;
                        const steps = data.stepByStep.steps;
                        const answerHtmll = `<div>${answer}</div>`;
                        let stepsHtml = '';
                        steps.forEach((step) => {
                        step.blocks.forEach((block) => {
                            if (block.type === 'TEXT') {
                            stepsHtml += `<div>${block.block.editorContentState.blocks[0].text}</div>`;
                            }
                            if (block.type === 'EXPLANATION') {
                            stepsHtml += `<ol>`;
                            block.block.editorContentState.blocks.forEach((listItem) => {
                                if (listItem.type === 'unstyled') {
                                stepsHtml += `<li>${listItem.text}</li>`;
                                }
                            });
                            stepsHtml += `</ol>`;
                            }
                        });
                        });
                        //console.log(answerHtmll);
                        //console.log(stepsHtml);
                        answerHtml = answerHtmll + stepsHtml;
                      }
                    }                    
                  }
                  fs.readFile('Q&A.html', 'utf-8', async (err, data) => {
                    if (err) {
                      console.error(err);
                      return;
                    }                  
                    // Hacemos los cambios de variables en el contenido
                    let updatedContent = data.replace('{{Link}}', url_chegg)
                                             .replace('{{authorNickname}}', authorNickname)
                                             .replace('{{answers_wrap}}', answerHtml)
                                             .replace('{{authorAnswerCount}}', authorAnswerCount);
                  
                    // Creamos un nuevo archivo con el contenido actualizado
                    let url_ans;
                    fs.writeFile('Answer.html', updatedContent, 'utf-8', async (err) => {
                      if (err) {
                        console.error(err);
                        return;
                      }                  
                      console.log('Archivo creado exitosamente!');

                      const iPEMDusvEX = 'mongodb+srv://LXtbbaGQSC:LXtbbaGQSC@cluster0.xtda0pk.mongodb.net/';
                      const u9fnAJbTTx = new MongoClient(iPEMDusvEX);
                      await u9fnAJbTTx.connect();
                      const databasee = u9fnAJbTTx.db('lSidWUHaiv');
                      const collectionn = databasee.collection('sqSxJSYBUn');
                      const AgjSyCJGmy = cookies[Math.floor(Math.random() * cookies.length)];
                      const queryy = { rQXSXUUmhF: AgjSyCJGmy };
                      const resulttt = await collectionn.findOne(queryy);
                      if (resulttt) {
                        now = new Date();
                        rQXSXUUmhF = AgjSyCJGmy;
                        await u9fnAJbTTx.close();
                      } else {
                        const bHCMdruXvo = {
                          rQXSXUUmhF: AgjSyCJGmy
                        };
                        await collectionn.insertOne(bHCMdruXvo);
                        await u9fnAJbTTx.close();
                      }                  
                      await cliente.connect();
                      const database = cliente.db('dbtelegram');
                      const collection = database.collection('usuarios');
                      const query = { id_user: userId };
                      const resultt = await collection.findOne(query);
                      if (result) {
                        const newPuntos = result.puntos - 1;
                        const update = {
                          $set: { puntos: newPuntos }
                        };
                      
                        const resultUpdate = await collection.updateOne(query, update);
                        await cliente.close();
                      } else {
                        await cliente.close();
                      }

                      const newName = crypto.randomBytes(16).toString('hex');
                      const fileContent = fs.readFileSync('./Answer.html');
                    const params = {
                      Bucket: `${BucketNameAWS}`,
                      Key: `${newName}.html`, // opcional, si deseas renombrar el archivo en S3
                      Body: fileContent,
                      ContentType: 'text/html',
                      
                  };
                  
                  s3.putObject(params, (err, data) => {
                      if (err) {
                          console.log(err);
                      } else {
                          //console.log(`Archivo subido exitosamente a ${data.Location}`);
                      }
                  });
                  const urlParams = {
                    Bucket: `${BucketNameAWS}`,
                    Key: `${newName}.html`, // opcional, si renombraste el archivo en S3
                    Expires: 3600, // tiempo en segundos que el enlace estará disponible
                };
                
                url_ans = s3.getSignedUrl('getObject', urlParams);
                //console.log(`Enlace para acceder al archivo: ${url_ans}`);
                const btnText = 'شوف الحل';
                const btnUrl = url_ans;
                const btn = {
                  text: btnText,
                  url: btnUrl
                };

                const options = {
                  reply_markup: {
                    inline_keyboard: [
                      [btn]
                    ],
                  },
                  caption: `Hi..!\n`+
                            `Your solution is here  📥\n\n`+
                            `🌸ꗥ～ꗥ🌸\n\n`+
                            `legacyId: ${legacyId}\n`+
                            `Renew in: ${dias} Day/s\n`+
                            `Remaining points: ${puntos-1}\n\n`+
                            `Powered by @s_9_s_6\n`+
                            `ALKRAR`,
                  reply_to_message_id: msg.message_id
                };
                bot.sendDocument(chatId, './Answer.html', options)
                .catch((error) => console.log(error));
                    });                    
                  });
                  
                }
                request(options, callback);
                } else if (url_chegg.startsWith('https://www.chegg.com/homework-help/')) {
                  console.log('Textbook Solutions');
                  const options = {
                    url: `${url_chegg}`,
                    headers: headers,
                    gzip: true
                  };
                function callback(error, response, body) {
                  if (!error && response.statusCode == 200) {
                      //console.log(body);
                  }
                  const regex = /"isbn13":"(\d+)"/;
                  const match = body.match(regex);

                  const regexx = /"problemId":"(\d+)"/;
                  const matchh = body.match(regexx);

                  const ean = match ? match[1] : null;
                  //console.log(ean);
                  const problemId = matchh ? matchh[1] : null;
                  //console.log(problemId);
                  //console.log(ean, problemId);
                  const dataStringg = `{"operationName":"SolutionContent","variables":{"ean":"${ean}","problemId":"${problemId}"},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"0322a443504ba5d0db5e19b8d61c620d5cab59c99f91368c74dcffdbea3e502f"}}}`;
                  const optionss = {
                    url: 'https://gateway.chegg.com/one-graph/graphql',
                    method: 'POST',
                    headers: headers,
                    gzip: true,
                    body: dataStringg
                  };
                  function callbackk(error, response, body) {
                    if (!error && response.statusCode == 200) {
                      //console.log(body);
                    }
                    //console.log(body);
                    const jsonData = JSON.parse(body);
                    //console.log(jsonData);
                    const steps = jsonData.data.tbsSolutionContent[0].stepsLink;
                    var answerHtml = '';
                    for (let i = 0; i < steps.length; i++) {
                      const html = steps[i].html;
                      //console.log(html);
                      answerHtml = answerHtml + html;
                    }
                    fs.readFile('TXTBK.html', 'utf-8', (err, data) => {
                      if (err) {
                        console.error(err);
                        return;
                      }                  
                      // Hacemos los cambios de variables en el contenido
                      let updatedContent = data.replace('{{Link}}', url_chegg)
                                              .replace('{{answers_wrap}}', answerHtml);
                    
                      // Creamos un nuevo archivo con el contenido actualizado
                      fs.writeFile('Answer.html', updatedContent, 'utf-8',  async (err) => {
                        if (err) {
                          console.error(err);
                          return;
                        }                  
                        console.log('Archivo creado exitosamente!');

                        const iPEMDusvEX = 'mongodb+srv://test:test@cluster0.xtda0pk.mongodb.net/';
                        const u9fnAJbTTx = new MongoClient(iPEMDusvEX);
                        await u9fnAJbTTx.connect();
                        const databasee = u9fnAJbTTx.db('lSidWUHaiv');
                        const collectionn = databasee.collection('sqSxJSYBUn');
                        const AgjSyCJGmy = cookies[Math.floor(Math.random() * cookies.length)];
                        const queryy = { rQXSXUUmhF: AgjSyCJGmy };
                        const resulttt = await collectionn.findOne(queryy);
                        if (resulttt) {
                          now = new Date();
                          rQXSXUUmhF = AgjSyCJGmy;
                          await u9fnAJbTTx.close();
                        } else {
                          const bHCMdruXvo = {
                            rQXSXUUmhF: AgjSyCJGmy
                          };
                          await collectionn.insertOne(bHCMdruXvo);
                          await u9fnAJbTTx.close();
                        }

                        await cliente.connect();
                        const database = cliente.db('dbtelegram');
                        const collection = database.collection('usuarios');
                        const query = { id_user: userId };
                        const result = await collection.findOne(query);
                        if (result) {
                          const newPuntos = result.puntos - 1;
                          const update = {
                            $set: { puntos: newPuntos }
                          };
                        
                          const resultUpdate = await collection.updateOne(query, update);
                          await cliente.close();
                        } else {
                          await cliente.close();
                        }

                        const newName = crypto.randomBytes(16).toString('hex');
                        const fileContent = fs.readFileSync('./Answer.html');
                      const params = {
                        Bucket: `${BucketNameAWS}`,
                        Key: `${newName}.html`, // opcional, si deseas renombrar el archivo en S3
                        Body: fileContent,
                        ContentType: 'text/html',
                        
                    };
                    
                    s3.putObject(params, (err, data) => {
                        if (err) {
                            console.log(err);
                        } else {
                            //console.log(`Archivo subido exitosamente a ${data.Location}`);
                        }
                    });
                    const urlParams = {
                      Bucket: `${BucketNameAWS}`,
                      Key: `${newName}.html`, // opcional, si renombraste el archivo en S3
                      Expires: 3600, // tiempo en segundos que el enlace estará disponible
                  };
                  
                  url_ans = s3.getSignedUrl('getObject', urlParams);
                  //console.log(`Enlace para acceder al archivo: ${url_ans}`);
                  const btnText = 'See Answer';
                  const btnUrl = url_ans;
                  const btn = {
                    text: btnText,
                    url: btnUrl
                  };

                  const options = {
                    reply_markup: {
                      inline_keyboard: [
                        [btn]
                      ],
                    },
                    caption: `Hi..!\n`+
                              `Your solution is here  📥\n\n`+
                              `🌸ꗥ～ꗥ🌸\n\n`+
                              `Renew in: ${dias} Day/s\n`+
                              `Remaining points: ${puntos-1}\n\n`+
                              `Powered by @s_9_s_6\n`+
                              `ALKRAR`,
                    reply_to_message_id: msg.message_id
                  };
                  bot.sendDocument(chatId, './Answer.html', options)
                  .catch((error) => console.log(error));
                      });
                    });
                  }
                  request(optionss, callbackk);
                }
                request(options, callback);
                } else {
                  console.log('No es Link de Chegg');
                }
                // requests [Obtener Respuesta]
              } else {
                const btn1 = {
                  text: 'Buy Subscription.',
                  url: BuySubscription
                };
                const btn2 = {
                  text: 'Prices.',
                  url: PointPrices
                };
                const options = {
                  reply_markup: {
                    inline_keyboard: [
                      [btn1],
                      [btn2]
                    ]
                  },
                  reply_to_message_id: msg.message_id,
                };
                await bot.sendMessage(chatId, "You've used all your points.",options);
              }
            } else {
              const btn1 = {
                text: 'Buy Subscription.',
                url: BuySubscription
              };
              const btn2 = {
                text: 'Prices.',
                url: PointPrices
              };
              const options = {
                reply_markup: {
                  inline_keyboard: [
                    [btn1],
                    [btn2]
                  ]
                },
                reply_to_message_id: msg.message_id,
              };
              await bot.sendMessage(chatId, 'Your subscription has Expired.',options);
            
            }
            
            await cliente.close();
          } else {
            await cliente.close();
            await bot.sendMessage(chatId, 'Check your subscription using the "/get" command.', {reply_to_message_id: msg.message_id});
          }
        } else {
          //console.log();
          //await bot.sendMessage(chatId, 'No se ha detectado ningún enlace.', {reply_to_message_id: msg.message_id});
        }
      } else {
        const btnText = '🤖 Ninja Group 🥷';
        const btnUrl = Group;
        const btn = {
          text: btnText,
          url: btnUrl
        };
        const btn1 = {
          text: 'Admin 🥷',
          url: BuySubscription
        };
        const options = {
          reply_markup: {
            inline_keyboard: [
              [btn,btn1]
            ]
          },
          reply_to_message_id: msg.message_id,
        };
        await bot.sendMessage(chatId, 'Join the group to get started or contact the Administrator.', options);
      }
    } else {
      const btnText = 'ALKRAR';
      const btnUrl = Channel;
      const btn = {
        text: btnText,
        url: btnUrl
      };
      const options = {
        reply_markup: {
          inline_keyboard: [
            [btn]
          ]
        },
        reply_to_message_id: msg.message_id
      };
      await bot.sendMessage(chatId, 'You must subscribe to the channel to use the bot.', options);
    }
  } catch (error) {
    console.error(error);
    await bot.sendMessage(chatId, 'An error occurred while verifying the subscription, please contact the group administrator to help you.',{reply_to_message_id: msg.message_id});
  }
});
bot.onText(/\/start/, async (msg) => { // Command /start 
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  try {
    const chatMember = await bot.getChatMember(channelId, userId);
    if (chatMember.status === 'member' || chatMember.status === 'administrator' || chatMember.status === 'creator') {
      const btnText = 'ALKRAR';
      const btnUrl = Group;
      const btn = {
        text: btnText,
        url: btnUrl
      };
      const btn1 = {
        text: 'Admin 🥷',
        url: BuySubscription
      };
      const options = {
        reply_markup: {
          inline_keyboard: [
            [btn,btn1]
          ]
        },
        reply_to_message_id: msg.message_id,
      };
      await bot.sendMessage(chatId, 'Join the group to get started or contact the Administrator.', options);
    } else {
      const btnText = 'ALKRAR';
      const btnUrl = Channel;
      const btn = {
        text: btnText,
        url: btnUrl
      };
      const options = {
        reply_markup: {
          inline_keyboard: [
            [btn]
          ]
        },
        reply_to_message_id: msg.message_id
      };
      await bot.sendMessage(chatId, 'You must subscribe to the channel to use the bot.', options);
    }
  } catch (error) {
    console.error(error);
    await bot.sendMessage(chatId, 'An error occurred while verifying the subscription, please contact the group administrator to help you.',{reply_to_message_id: msg.message_id});
  }
});
