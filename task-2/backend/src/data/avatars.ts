const names = ['Luis', 'Mackenzie', 'Aidan', 'Maria', 'George', 'Caleb', 'Brooklynn'];

export const generateAvatar = () => {
  const name = names[Math.floor(Math.random() * names.length)];
  const avatar = `https://api.dicebear.com/9.x/notionists/svg?seed=${name}`;
  return avatar;
};
