import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import ScheduleForm from '@/components/ScheduleForm';

const SchedulePage = () => {
    return (
        <div className="container mx-auto p-4">
            <SignedIn>
                <h1 className="text-2xl font-bold mb-4">Schedule an Appointment</h1>
                <ScheduleForm />
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </div>
    );
};

export default SchedulePage;
