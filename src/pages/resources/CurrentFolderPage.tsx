// ============== imports: the dependencies ==============
import { v4 } from "uuid"
// ======= react ==========
import { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
// ======= chakra UI ==========
import {
    SimpleGrid,
    useToast,
    Box,
    Flex,
    Input,
    FormLabel,
    Heading,
    Link as ChakraLink,
    Button,
} from "@chakra-ui/react"
// ======= firebase ==========
import {
    getFolderByFolderId,
    getAllFilesFromFolder,
} from "../../helperFunctions/firebase/fileFunctions"
import { db, storage } from "../../config"
import {
    ref as storageRef,
    uploadBytes,
    getDownloadURL,
} from "firebase/storage"
import { collection, addDoc, getDocs } from "firebase/firestore"
// ======= zustand/state ==========
import useUser from "../../store/userStore"
// ======= custom components (if any)==========
import CustomButton from "../../components/general/CustomButton"
import InputField from "../../components/general/InputField"
import LoadingComponent from "../../components/general/LoadingComponent"
// ============== interfaces (if any) ==============

// ============== external variables (if any) ==============

// ======= external functions  ==========

// ============== main component ==============
export default function CurrentFolderPage() {
    // ============== constant variables if any ==============
    const toast = useToast()
    const { user } = useUser()
    const { folderId } = useParams()
    const navigate = useNavigate()

    // ============== states (if any) ==============
    const [folderName, setFolderName] = useState("")
    const [uploading, setUploading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState(null)
    const [fileName, setFileName] = useState("")
    const [folderFiles, setFolderFiles] = useState([])
    // ============== useEffect statement(s) ==============
    useEffect(() => {
        // check if user logged in
        console.log("user")
        // not login, kick to /login
        if (!user) {
            navigate("/login")
        } else if (user.userType != 2 && !user.companyId) {
            navigate("/home")
        }
        // else
        else {
            setLoading(true)
            let currentCompanyId
            if (user.userType == 2) {
                currentCompanyId = user.userId
            } else {
                currentCompanyId = user.companyId
            }
            if (!userInCompany(currentCompanyId)) {
                navigate("/resources")
            }
            // load all the folders
            loadAllFiles()
            setLoading(false)
        }
        // check if user is in the company
    }, [])

    // ============== helper functions if any ==============
    const handleFileNameChange = (e: any) => {
        setFileName(e.target.value)
    }
    const userInCompany = async (companyId: string) => {
        const currentFolder = await getFolderByFolderId(folderId)
        if (currentFolder && currentFolder.companyId == companyId) {
            setFolderName(currentFolder.folderName)
            return true
        }
        return false
    }

    const handleFileChange = (currFile: any) => {
        setFileName(currFile.name)
        setFile(currFile)
    }

    const resetInput = () => {
        setFile(null)
        setFileName("")
    }
    // ============== key functions if any ==============
    const sendFile = async () => {
        if (!file || !fileName) {
            toast({
                title: "File failed to add.",
                description: "Please fill in all the fields.",
                status: "error",
                duration: 1000,
                isClosable: true,
            })
        } else {
            setUploading(true)
            const imageRef = storageRef(
                storage,
                `${folderId}/${fileName + v4()}`,
            )
            await uploadBytes(imageRef, file)
                .then(async snapshot => {
                    await getDownloadURL(snapshot.ref).then(async url => {
                        await addDoc(collection(db, "file"), {
                            fileName,
                            fileUrl: url,
                            folderId,
                        })
                            .then(() => {
                                resetInput()
                                loadAllFiles()
                                setUploading(false)
                                toast({
                                    title: "File successfully added!",
                                    description: "",
                                    status: "success",
                                    duration: 1000,
                                    isClosable: true,
                                })
                            })
                            .catch(err => {
                                setUploading(false)
                                toast({
                                    title: "File failed to add.",
                                    description: "Please try again.",
                                    status: "error",
                                    duration: 1000,
                                    isClosable: true,
                                })
                            })
                    })
                })
                .catch(err => {
                    setUploading(false)
                    toast({
                        title: "File failed to add.",
                        description: "Please try again.",
                        status: "error",
                        duration: 1000,
                        isClosable: true,
                    })
                })
        }
    }

    const loadAllFiles = async () => {
        const allFiles = await getAllFilesFromFolder(folderId)
        setFolderFiles(allFiles)
    }
    return (
        <>
            {loading ? (
                <>
                    <LoadingComponent message="Getting files" />
                </>
            ) : (
                <>
                    <Link to="/resources">(Back to Resources)</Link>
                    <Heading>{folderName}</Heading>
                    <SimpleGrid columns={[2, 3, null, 4]} spacing={5}>
                        {uploading ? (
                            <>
                                <LoadingComponent message="Uploading file ..." />
                            </>
                        ) : (
                            <>
                                {" "}
                                {user && user.userType == 2 ? (
                                    <>
                                        {" "}
                                        <AddFileFormProps
                                            name={fileName}
                                            changeNameHandler={
                                                handleFileNameChange
                                            }
                                            changeFileHandler={handleFileChange}
                                            handleSubmit={sendFile}
                                            handleCancel={resetInput}
                                        />
                                    </>
                                ) : (
                                    <> </>
                                )}
                            </>
                        )}
                        {folderFiles.map((file: any) => {
                            const { fileName, fileUrl } = file
                            return (
                                <FileContainer
                                    fileName={fileName}
                                    fileUrl={fileUrl}
                                />
                            )
                        })}
                    </SimpleGrid>
                </>
            )}
        </>
    )
}

// ============== sub component(s) if any ==============

interface AddFileFormProps {
    name: string
    changeNameHandler: () => void
    value: unknown
    changeFileHandler: () => void
    handleSubmit: () => void
    handleCancel: () => void
}
// form to add file
export const AddFileFormProps = ({
    name,
    changeNameHandler,
    changeFileHandler,
    handleSubmit,
    handleCancel,
}: any) => {
    return (
        <Box
            background="white"
            borderRadius="5px"
            padding="10px"
            height="240px">
            <InputField
                label="Set file name"
                placeholder="Edit File name"
                formType="text"
                value={name}
                changeHandler={changeNameHandler}
            />
            <FormLabel>Add a file:</FormLabel>
            <Input
                type="file"
                onChange={(e: any) => {
                    changeFileHandler(e.target.files[0])
                }}
                accept="*"
            />
            <Flex>
                <CustomButton
                    buttonText="Cancel"
                    textColor={"white"}
                    buttonColor={"#6D6D6D"}
                    buttonOnClick={handleCancel}
                    disabled={false}
                />
                <CustomButton
                    buttonText="Add File"
                    textColor={"white"}
                    buttonColor={"#3609EA"}
                    buttonOnClick={handleSubmit}
                    disabled={false}
                />
            </Flex>
        </Box>
    )
}

// file container (display the stuff)
export const FileContainer = ({ fileName, fileUrl }: any) => {
    return (
        <Box
            background="white"
            borderRadius="5px"
            padding="30px"
            height="240px">
            <Heading as="h3" size="lg" noOfLines={1} margin="15px">
                {fileName}
            </Heading>

            <ChakraLink href={fileUrl} target="_blank" margin="15px">
                <Button padding="25px" color="white" background="#2A07B7">
                    View
                </Button>
            </ChakraLink>
            <br />
        </Box>
    )
}
