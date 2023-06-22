// ============== imports: the dependencies ==============
// ======= react ==========
import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"

// ======= chakra UI ==========
import { SimpleGrid, useToast, Box, Text, Heading } from "@chakra-ui/react"
// ======= firebase ==========
import {
    getFoldersByCompanyId,
    addFolder,
} from "../../helperFunctions/firebase/fileFunctions"
// ======= zustand/state ==========
import useUser from "../../store/userStore"

// ======= custom components (if any)==========
import LoadingComponent from "../../components/general/LoadingComponent"
import InputField from "../../components/general/InputField"
import CustomButton from "../../components/general/CustomButton"
// ============== interfaces (if any) ==============

// ============== external variables (if any) ==============

// ======= external functions  ==========

// ============== main component ==============
export default function ResourcesPage() {
    // ============== constant variables if any ==============
    const navigate = useNavigate()
    const { user } = useUser()
    const toast = useToast()
    // ============== states (if any) ==============
    const [loading, setLoading] = useState(false)
    const [folderName, setFolderName] = useState("")
    const [companyFolders, setCompanyFolders] = useState([])
    // ============== useEffect statement(s) ==============
    useEffect(() => {
        if (!user) {
            navigate("/login")
        }
        // if (user.userType != 2 && !user.companyId) {
        //     navigate("/home")
        // }
        getCompanyFolders()
    }, [])
    // ============== helper functions if any ==============
    const handleFolderNameChange = (e: any) => {
        setFolderName(e.target.value)
    }

    // ============== key functions if any ==============
    // add a folder
    const addNewFolder = async () => {
        if (folderName == "") {
            toast({
                title: "Folder failed to add.",
                description: "",
                status: "error",
                duration: 1000,
                isClosable: true,
            })
        } else {
            let currentCompanyId
            if (user.userType === 2) {
                currentCompanyId = user.userId
            } else {
                currentCompanyId = user.companyId
            }
            const gotFolder = await addFolder(folderName, currentCompanyId)
            if (gotFolder) {
                setFolderName("")
                toast({
                    title: "Folder added.",
                    description: "Folder has been added.",
                    status: "success",
                    duration: 1000,
                    isClosable: true,
                })
                await getCompanyFolders()
            } else {
                toast({
                    title: "Folder failed to add.",
                    description: "",
                    status: "error",
                    duration: 1000,
                    isClosable: true,
                })
            }
        }
    }

    // get all folders of company
    const getCompanyFolders = async () => {
        setLoading(true)
        console.log(user)
        let currentCompanyId
        if (user.userType == 2) {
            currentCompanyId = user.userId
        } else {
            currentCompanyId = user.companyId
        }
        const folders = await getFoldersByCompanyId(currentCompanyId)
        console.log("folders", folders)
        setCompanyFolders(folders)
        // "0g4fjfWZE7dWhJxQMnePG1jJBmm2"
        setLoading(false)
    }

    return (
        <>
            {loading ? (
                <>
                    <LoadingComponent message="Retrieving contents" />
                </>
            ) : (
                <>
                    <SimpleGrid columns={[2, 3, null, 4]} spacing={5}>
                        {user && user.userType == 2 ? (
                            <>
                                {" "}
                                <AddFolderForm
                                    changeNameHandler={handleFolderNameChange}
                                    name={folderName}
                                    handleSubmit={addNewFolder}
                                />
                            </>
                        ) : null}

                        {
                            // display folders
                            companyFolders.map((folder: Folder) => {
                                const { folderId, folderName } = folder
                                return (
                                    <FolderContainer
                                        folderId={folderId}
                                        folderName={folderName}
                                    />
                                )
                            })
                        }
                    </SimpleGrid>
                </>
            )}
        </>
    )
}

// ============== sub component(s) if any ==============

// ======== adding of folder ========
function AddFolderForm({ changeNameHandler, name, handleSubmit }: any) {
    return (
        <Box
            background="white"
            borderRadius="5px"
            padding="10px"
            height="160px">
            <InputField
                label="Folder Name"
                placeholder="Enter folder name"
                formType="text"
                value={name}
                changeHandler={changeNameHandler}
            />
            <CustomButton
                buttonText="Add Folder"
                textColor={"white"}
                buttonColor={"#3609EA"}
                buttonOnClick={handleSubmit}
                disabled={false}
            />
        </Box>
    )
}

// ======== folder container ========
interface Folder {
    folderId: string
    folderName: string
}
function FolderContainer({ folderId, folderName }: Folder) {
    return (
        <Box
            background="white"
            borderRadius="5px"
            padding="30px"
            width="fill-content"
            marginBottom="10px"
            height="160px">
            <Heading as="h3" size="xl" noOfLines={1}>
                {folderName}
            </Heading>
            <br />
            <Text fontSize="md" color="gray.500">
                <Link to={`/resources/${folderId}`}>View Folder ..</Link>
            </Text>
        </Box>
    )
}
