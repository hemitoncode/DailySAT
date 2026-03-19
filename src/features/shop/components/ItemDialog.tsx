import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { Store } from "lucide-react";
import { toast } from "react-toastify";

export default function ItemDialog({ user }: { user: any }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <div
          onClick={(e) => {
            if (!user.itemsBought?.length) {
              e.stopPropagation();
              toast.error("You don't have any items to display", {
                position: "bottom-right",
                pauseOnHover: false,
              });
              return;
            }
          }}
          className="absolute bottom-2 left-2 w-8 h-8 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:border-blue-300 hover:bg-blue-50 transition cursor-pointer"
        >
          <Store size={16} className="text-blue-500" />
        </div>
      </AlertDialogTrigger>

      <AlertDialogContent className="rounded-2xl border border-gray-200 shadow-xl">
        <AlertDialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
              <Store size={14} className="text-blue-500" />
            </div>
            <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-blue-500">
              Inventory
            </p>
          </div>
          <AlertDialogTitle className="text-2xl font-bold text-gray-900 tracking-tight">
            Your Items
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="max-h-[300px] overflow-auto space-y-2 mt-2">
              {user.itemsBought.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-slate-50 border border-gray-200 rounded-xl px-4 py-3"
                >
                  <span className="text-xs font-semibold text-gray-900 w-1/2 truncate">{item.name}</span>
                  <span className="text-xs text-gray-500 w-1/4 text-center">×{item.amnt}</span>
                  <span className="text-xs font-semibold text-blue-500 w-1/4 text-right">{item.price} coins</span>
                </div>
              ))}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-2">
          <AlertDialogCancel className="w-full rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-slate-50 hover:text-gray-900 transition">
            Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
