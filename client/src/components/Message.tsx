
import { useState } from 'react'
import {
  FaceFrownIcon,
  FaceSmileIcon,
  FireIcon,
  HandThumbUpIcon,
  HeartIcon,
  PaperClipIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid'
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'

// const moods = [
//   { name: 'Excited', value: 'excited', icon: FireIcon, iconColor: 'text-white', bgColor: 'bg-red-500' },
//   { name: 'Loved', value: 'loved', icon: HeartIcon, iconColor: 'text-white', bgColor: 'bg-pink-400' },
//   { name: 'Happy', value: 'happy', icon: FaceSmileIcon, iconColor: 'text-white', bgColor: 'bg-green-400' },
//   { name: 'Sad', value: 'sad', icon: FaceFrownIcon, iconColor: 'text-white', bgColor: 'bg-yellow-400' },
//   { name: 'Thumbsy', value: 'thumbsy', icon: HandThumbUpIcon, iconColor: 'text-white', bgColor: 'bg-blue-500' },
//   { name: 'I feel nothing', value: null, icon: XMarkIcon, iconColor: 'text-gray-400', bgColor: 'bg-transparent' },
// ]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Message( {userName}) {
//   const [selected, setSelected] = useState(moods[5])

  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0">
        <img
          alt=""
          src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          className="inline-block h-10 w-10 rounded-full"
        />
      </div>
      <div className="min-w-0 flex-1 ">
        <form action="#" className="relative">
          <div className="overflow-hidden rounded-lg shadow-sm ">
            <div className='ring-1 ring-inset ring-gray-300 focus-within:ring-2'>
            <label htmlFor="comment" className="sr-only">
              Trimite mesaj catre {userName}
            </label>
            <textarea
              id="comment"
              name="comment"
              rows={3}
              placeholder={`   Trimite mesaj catre ${userName}`}
              className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              defaultValue={''}
            />
</div>
            {/* Spacer element to match the height of the toolbar */}
            <div aria-hidden="true" className="py-2">
              {/* Matches height of button in toolbar (1px border + 36px content height) */}
              <div className="py-px">
                <div className="h-9" />
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex justify-end py-2 pl-3 pr-2 ju">
            {/* <div className="flex items-center space-x-5">
              <div className="flex items-center">
                <button
                  type="button"
                  className="-m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                >
                  <PaperClipIcon aria-hidden="true" className="h-5 w-5" />
                  <span className="sr-only">Attach a file</span>
                </button>
              </div>
              <div className="flex items-center">
                <Listbox value={selected} onChange={setSelected}>
                  <Label className="sr-only">Your mood</Label>
                  <div className="relative">
                    <ListboxButton className="relative -m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500">
                      <span className="flex items-center justify-center">
                        {selected.value === null ? (
                          <span>
                            <FaceSmileIcon aria-hidden="true" className="h-5 w-5 flex-shrink-0" />
                            <span className="sr-only">Add your mood</span>
                          </span>
                        ) : (
                          <span>
                            <span
                              className={classNames(
                                selected.bgColor,
                                'flex h-8 w-8 items-center justify-center rounded-full',
                              )}
                            >
                              <selected.icon aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-white" />
                            </span>
                            <span className="sr-only">{selected.name}</span>
                          </span>
                        )}
                      </span>
                    </ListboxButton>

                    <ListboxOptions
                      transition
                      className="absolute z-10 -ml-6 mt-1 w-60 rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:ml-auto sm:w-64 sm:text-sm"
                    >
                      {moods.map((mood) => (
                        <ListboxOption
                          key={mood.value}
                          value={mood}
                          className="relative cursor-default select-none bg-white px-3 py-2 data-[focus]:bg-gray-100"
                        >
                          <div className="flex items-center">
                            <div
                              className={classNames(
                                mood.bgColor,
                                'flex h-8 w-8 items-center justify-center rounded-full',
                              )}
                            >
                              <mood.icon
                                aria-hidden="true"
                                className={classNames(mood.iconColor, 'h-5 w-5 flex-shrink-0')}
                              />
                            </div>
                            <span className="ml-3 block truncate font-medium">{mood.name}</span>
                          </div>
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </div>
                </Listbox>
              </div>
            </div> */}
            <div className="flex-shrink-0 ">
              <button
                type="submit"
                className="inline-flex items-center rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 "
              >
                Trimite
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
