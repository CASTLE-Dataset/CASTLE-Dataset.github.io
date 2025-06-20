import AllView from 'AllView'
import IndividualView from 'IndividualView'
import { useState } from 'react'

export default function VideoSchedule() {
    const [selectedView, setSelectedView] = useState<'individual' | 'all'>(
        'individual'
    )

    return (
        <div className="space-y-4 p-4">
            <div className="flex space-y-2">
                <button
                    onClick={() => setSelectedView('individual')}
                    className={
                        selectedView === 'individual' ? 'selected' : 'outline'
                    }
                >
                    Individual View
                </button>
                <button
                    onClick={() => setSelectedView('all')}
                    className={selectedView === 'all' ? 'selected' : 'outline'}
                >
                    All View
                </button>
            </div>
            <div>
                {selectedView === 'individual' ? (
                    <IndividualView />
                ) : (
                    <AllView />
                )}
            </div>
        </div>
    )
}
