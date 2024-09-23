import HoverBox from "@component/HoverBox";
import { H4 } from "@component/Typography";
import NextImage from "@component/NextImage";

// ====================================================================
type ProductCard5Props = { imgUrl: string; title: string ,height:number,width:number};
// ====================================================================

export default function ProductCard5({ imgUrl, title,height,width }: ProductCard5Props) {
  const heights=height?height:175;
  const widths=width?width:260;
  return (
    <div>
      <HoverBox borderRadius={5} mb="0.5rem" display="flex">
       
        <NextImage alt={title} src={imgUrl} width={widths} height={heights} />
     
      
      </HoverBox>

      <H4 fontSize="14px" fontWeight="600">
        {title}
      </H4>
    </div>
  );
}
