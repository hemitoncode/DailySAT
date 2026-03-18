import { create } from 'zustand';

interface EditorialData {
    id: number;
    questionID: number;
    body: string;
    reasoning: string;
}

interface EditorialStore {
    editorial: EditorialData[];
    setEditorial: (editorial: EditorialData[]) => void;
    resetEditorial: () => void;
}

const useEditorialStore = create<EditorialStore>((set) => ({
    editorial: [], // Initialize with an empty array
    
    setEditorial: (editorial) => set({ editorial }), // Set the entire list of editorial data
    
    resetEditorial: () => set({ editorial: [] }), // Reset the editorial list to an empty array
}));

export default useEditorialStore;
