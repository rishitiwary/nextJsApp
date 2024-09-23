import Typography, { H3 } from "@component/Typography";
type Props = {
  description:string;
  name:string;
  brand:string;
};

export default function ProductDescription({name,brand,description}:Props) {
  return (
    <div>
      <H3 mb="1rem">Specification:</H3>
      <Typography>
        Name: {name} <br />
        Brand: {brand} <br />
       
       {description}
      </Typography>
    </div>
  );
}
