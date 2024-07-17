import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react";

type Props = {
  isLoading: boolean;
  className?: string;
  children: React.ReactNode
}

const SubmitButton = ({isLoading, children, className}: Props) => {
  return (
    <Button type="submit" className={className ?? 'shad-primary-btn w-full'} disabled={isLoading}>
      {isLoading ? <div className="flex items-center gap-4">
        <Loader2 className=" animate-spin"/> Loading...
      </div> :  children
      }
      </Button>
  )
}

export default SubmitButton
