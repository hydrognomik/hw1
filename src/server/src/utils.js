const msToTime = ms => {
  const secNum = ms / 1000;
  let hrs = Math.floor(secNum / 3600);
  let mnts = Math.floor((secNum - (hrs * 3600)) / 60);
  let scnds = Math.floor(secNum - (hrs * 3600) - (mnts * 60));

  if (hrs < 10) { hrs = `0${hrs}`; }
  if (mnts < 10) { mnts = `0${mnts}`; }
  if (scnds < 10) { scnds = `0${scnds}`; }

  return `${hrs}:${mnts}:${scnds}`;
};

module.exports.msToTime = msToTime;
